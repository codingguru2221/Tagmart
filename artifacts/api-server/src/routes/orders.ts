import { Router } from "express";
import { db, ordersTable, orderItemsTable, productsTable, usersTable } from "@workspace/db";
import { eq, sql, and, inArray } from "drizzle-orm";
import { CreateOrderBody, UpdateOrderStatusBody } from "@workspace/api-zod";
import { parseToken } from "./auth";

const router = Router();

async function buildOrderResponse(order: typeof ordersTable.$inferSelect) {
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));
  return {
    id: order.id,
    userId: order.userId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    status: order.status,
    total: Number(order.total),
    fulfillmentMethod: order.fulfillmentMethod,
    address: order.address,
    phone: order.phone,
    createdAt: order.createdAt.toISOString(),
    items: items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      quantity: i.quantity,
      price: Number(i.price),
      imageUrl: i.imageUrl,
    })),
  };
}

router.get("/orders", async (req, res) => {
  const authHeader = req.headers.authorization;
  const tokenData = authHeader?.startsWith("Bearer ") ? parseToken(authHeader.slice(7)) : null;

  const status = req.query.status as string | undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const offset = req.query.offset ? Number(req.query.offset) : 0;

  const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;

  let query = db.select().from(ordersTable);

  const conditions = [];
  if (tokenData && tokenData.role !== "admin") {
    conditions.push(eq(ordersTable.userId, tokenData.userId));
  }
  if (status && validStatuses.includes(status as typeof validStatuses[number])) {
    conditions.push(eq(ordersTable.status, status as typeof validStatuses[number]));
  }

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const orders = await db
    .select()
    .from(ordersTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(limit)
    .offset(offset)
    .orderBy(sql`${ordersTable.createdAt} desc`);

  const ordersWithItems = await Promise.all(orders.map(buildOrderResponse));

  res.json({ orders: ordersWithItems, total: countRow?.count ?? 0 });
});

router.post("/orders", async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const authHeader = req.headers.authorization;
  const tokenData = authHeader?.startsWith("Bearer ") ? parseToken(authHeader.slice(7)) : null;

  let customerName = "Guest";
  let customerEmail = "guest@tagmart.com";
  let userId: number | null = null;

  if (tokenData) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, tokenData.userId)).limit(1);
    if (user) {
      customerName = user.name;
      customerEmail = user.email;
      userId = user.id;
    }
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const products = await db.select().from(productsTable).where(inArray(productsTable.id, productIds));

  let total = 0;
  const itemsToInsert: Array<{ productId: number; productName: string; quantity: number; price: string; imageUrl?: string }> = [];

  for (const item of parsed.data.items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }
    const price = Number(product.price);
    total += price * item.quantity;
    itemsToInsert.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      price: String(price),
      imageUrl: product.imageUrl ?? undefined,
    });
  }

  const [order] = await db
    .insert(ordersTable)
    .values({
      userId,
      customerName,
      customerEmail,
      status: "pending",
      total: String(total),
      fulfillmentMethod: parsed.data.fulfillmentMethod ?? "delivery",
      address: parsed.data.address,
      phone: parsed.data.phone,
    })
    .returning();

  await db.insert(orderItemsTable).values(itemsToInsert.map((i) => ({ ...i, orderId: order.id })));

  res.status(201).json(await buildOrderResponse(order));
});

router.get("/orders/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id)).limit(1);
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(await buildOrderResponse(order));
});

router.put("/orders/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, id))
    .returning();
  if (!order) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(await buildOrderResponse(order));
});

export default router;
