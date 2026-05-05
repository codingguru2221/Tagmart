import { Router } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, sql, ilike, and } from "drizzle-orm";
import {
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
  ListProductsQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/products/featured", async (_req, res) => {
  const rows = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      imageUrl: productsTable.imageUrl,
      stock: productsTable.stock,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      featured: productsTable.featured,
      rating: productsTable.rating,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.featured, true))
    .limit(12);

  res.json(
    rows.map((r) => ({
      ...r,
      price: Number(r.price),
      originalPrice: r.originalPrice ? Number(r.originalPrice) : undefined,
      rating: r.rating ? Number(r.rating) : undefined,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.get("/products", async (req, res) => {
  const rawParams = {
    categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
    search: req.query.search as string | undefined,
    featured: req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined,
    limit: req.query.limit ? Number(req.query.limit) : 20,
    offset: req.query.offset ? Number(req.query.offset) : 0,
  };

  const conditions = [];
  if (rawParams.categoryId) conditions.push(eq(productsTable.categoryId, rawParams.categoryId));
  if (rawParams.search) conditions.push(ilike(productsTable.name, `%${rawParams.search}%`));
  if (rawParams.featured !== undefined) conditions.push(eq(productsTable.featured, rawParams.featured));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(whereClause);

  const rows = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      imageUrl: productsTable.imageUrl,
      stock: productsTable.stock,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      featured: productsTable.featured,
      rating: productsTable.rating,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(whereClause)
    .limit(rawParams.limit)
    .offset(rawParams.offset);

  res.json({
    products: rows.map((r) => ({
      ...r,
      price: Number(r.price),
      originalPrice: r.originalPrice ? Number(r.originalPrice) : undefined,
      rating: r.rating ? Number(r.rating) : undefined,
      createdAt: r.createdAt.toISOString(),
    })),
    total: countRow?.count ?? 0,
  });
});

router.post("/products", async (req, res) => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
    return;
  }
  const [product] = await db
    .insert(productsTable)
    .values({
      ...parsed.data,
      price: String(parsed.data.price),
      originalPrice: parsed.data.originalPrice ? String(parsed.data.originalPrice) : undefined,
    })
    .returning();
  const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
  res.status(201).json({
    ...product,
    categoryName: cat?.name,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    rating: product.rating ? Number(product.rating) : undefined,
    createdAt: product.createdAt.toISOString(),
  });
});

router.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [row] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      description: productsTable.description,
      price: productsTable.price,
      originalPrice: productsTable.originalPrice,
      imageUrl: productsTable.imageUrl,
      stock: productsTable.stock,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      featured: productsTable.featured,
      rating: productsTable.rating,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id))
    .limit(1);

  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({
    ...row,
    price: Number(row.price),
    originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
    rating: row.rating ? Number(row.rating) : undefined,
    createdAt: row.createdAt.toISOString(),
  });
});

router.put("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set({
      ...parsed.data,
      price: String(parsed.data.price),
      originalPrice: parsed.data.originalPrice ? String(parsed.data.originalPrice) : undefined,
    })
    .where(eq(productsTable.id, id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, product.categoryId)).limit(1);
  res.json({
    ...product,
    categoryName: cat?.name,
    price: Number(product.price),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    rating: product.rating ? Number(product.rating) : undefined,
    createdAt: product.createdAt.toISOString(),
  });
});

router.delete("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.status(204).send();
});

export default router;
