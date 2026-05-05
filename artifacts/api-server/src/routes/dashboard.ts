import { Router } from "express";
import { db, ordersTable, productsTable, usersTable, orderItemsTable, categoriesTable } from "@workspace/db";
import { sql, eq, gte } from "drizzle-orm";

const router = Router();

router.get("/dashboard/stats", async (_req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalOrders] = await db.select({ count: sql<number>`count(*)::int` }).from(ordersTable);
  const [totalRevenue] = await db.select({ sum: sql<number>`coalesce(sum(total::numeric), 0)` }).from(ordersTable);
  const [totalProducts] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable);
  const [totalCustomers] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "customer"));
  const [pendingOrders] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending"));
  const [deliveredOrders] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "delivered"));
  const [todayOrders] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, today));
  const [todayRevenue] = await db
    .select({ sum: sql<number>`coalesce(sum(total::numeric), 0)` })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, today));

  res.json({
    totalOrders: totalOrders?.count ?? 0,
    totalRevenue: Number(totalRevenue?.sum ?? 0),
    totalProducts: totalProducts?.count ?? 0,
    totalCustomers: totalCustomers?.count ?? 0,
    pendingOrders: pendingOrders?.count ?? 0,
    deliveredOrders: deliveredOrders?.count ?? 0,
    todayOrders: todayOrders?.count ?? 0,
    todayRevenue: Number(todayRevenue?.sum ?? 0),
  });
});

router.get("/dashboard/recent-orders", async (_req, res) => {
  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(sql`${ordersTable.createdAt} desc`)
    .limit(10);

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
      return {
        id: order.id,
        userId: order.userId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        total: Number(order.total),
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
    })
  );

  res.json(ordersWithItems);
});

router.get("/dashboard/category-breakdown", async (_req, res) => {
  const categories = await db.select().from(categoriesTable);

  const breakdown = await Promise.all(
    categories.map(async (cat) => {
      const [productCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(productsTable)
        .where(eq(productsTable.categoryId, cat.id));

      const orderData = await db
        .select({
          orderCount: sql<number>`count(distinct ${orderItemsTable.orderId})::int`,
          revenue: sql<number>`coalesce(sum(${orderItemsTable.price}::numeric * ${orderItemsTable.quantity}), 0)`,
        })
        .from(orderItemsTable)
        .where(eq(orderItemsTable.productId, productsTable.id))
        .leftJoin(productsTable, eq(productsTable.categoryId, cat.id));

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        productCount: productCount?.count ?? 0,
        orderCount: orderData[0]?.orderCount ?? 0,
        revenue: Number(orderData[0]?.revenue ?? 0),
      };
    })
  );

  res.json(breakdown);
});

export default router;
