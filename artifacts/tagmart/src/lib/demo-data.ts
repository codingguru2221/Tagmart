import type { Category, ListProductsParams, Product, ProductList } from "@workspace/api-client-react";

export const demoCategories: Category[] = [
  {
    id: 1,
    name: "Groceries",
    slug: "groceries",
    description: "Daily kitchen essentials and fresh pantry picks.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Fashion",
    slug: "fashion",
    description: "Comfortable everyday clothing and accessories.",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Electronics",
    slug: "electronics",
    description: "Useful gadgets for work, home, and travel.",
    imageUrl: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Home Care",
    slug: "home-care",
    description: "Cleaning and household supplies.",
    imageUrl: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Beauty",
    slug: "beauty",
    description: "Personal care and grooming favorites.",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Stationery",
    slug: "stationery",
    description: "Office, school, and desk essentials.",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
  },
];

const categoryNameById = new Map(demoCategories.map((category) => [category.id, category.name]));

export const demoProducts: Product[] = [
  {
    id: 101,
    name: "Premium Basmati Rice 5 kg",
    description: "Long grain aromatic rice for biryani, pulao, and everyday meals.",
    price: 649,
    originalPrice: 799,
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=700&auto=format&fit=crop",
    stock: 28,
    categoryId: 1,
    featured: true,
    rating: 4.8,
  },
  {
    id: 102,
    name: "Cold Pressed Groundnut Oil 1 L",
    description: "Naturally pressed cooking oil with a rich, nutty flavor.",
    price: 285,
    originalPrice: 340,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=700&auto=format&fit=crop",
    stock: 35,
    categoryId: 1,
    featured: true,
    rating: 4.6,
  },
  {
    id: 103,
    name: "Mixed Dal Combo Pack 2 kg",
    description: "A balanced pack of moong, toor, masoor, and chana dal.",
    price: 429,
    imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?q=80&w=700&auto=format&fit=crop",
    stock: 20,
    categoryId: 1,
    featured: false,
    rating: 4.5,
  },
  {
    id: 201,
    name: "Men's Cotton Casual Shirt",
    description: "Breathable regular-fit shirt for daily wear.",
    price: 799,
    originalPrice: 1299,
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=700&auto=format&fit=crop",
    stock: 16,
    categoryId: 2,
    featured: true,
    rating: 4.4,
  },
  {
    id: 202,
    name: "Women's Printed Kurti",
    description: "Soft rayon kurti with a relaxed everyday fit.",
    price: 699,
    originalPrice: 999,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=700&auto=format&fit=crop",
    stock: 14,
    categoryId: 2,
    featured: true,
    rating: 4.7,
  },
  {
    id: 301,
    name: "Wireless Bluetooth Earbuds",
    description: "Compact earbuds with clear audio and up to 24 hours total playback.",
    price: 1499,
    originalPrice: 2499,
    imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?q=80&w=700&auto=format&fit=crop",
    stock: 18,
    categoryId: 3,
    featured: true,
    rating: 4.3,
  },
  {
    id: 302,
    name: "Fast Charging USB-C Cable",
    description: "Durable braided cable for phones, tablets, and accessories.",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=700&auto=format&fit=crop",
    stock: 42,
    categoryId: 3,
    featured: false,
    rating: 4.2,
  },
  {
    id: 401,
    name: "Lemon Floor Cleaner 2 L",
    description: "Fresh-fragrance cleaner for tiles, marble, and kitchen floors.",
    price: 189,
    originalPrice: 240,
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=700&auto=format&fit=crop",
    stock: 30,
    categoryId: 4,
    featured: true,
    rating: 4.6,
  },
  {
    id: 501,
    name: "Aloe Vera Face Wash",
    description: "Gentle daily cleanser for fresh and hydrated skin.",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=700&auto=format&fit=crop",
    stock: 24,
    categoryId: 5,
    featured: true,
    rating: 4.5,
  },
  {
    id: 601,
    name: "Classic Notebook Set of 3",
    description: "Ruled notebooks for school, office, planning, and notes.",
    price: 299,
    originalPrice: 399,
    imageUrl: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?q=80&w=700&auto=format&fit=crop",
    stock: 0,
    categoryId: 6,
    featured: false,
    rating: 4.1,
  },
].map((product) => ({
  ...product,
  categoryName: categoryNameById.get(product.categoryId),
}));

export const demoCategoriesWithCounts: Category[] = demoCategories.map((category) => ({
  ...category,
  productCount: demoProducts.filter((product) => product.categoryId === category.id).length,
}));

export function listDemoProducts(params: ListProductsParams = {}): ProductList {
  const search = params.search?.trim().toLowerCase();
  const offset = params.offset ?? 0;
  const limit = params.limit ?? demoProducts.length;

  let products = [...demoProducts];

  if (params.featured) {
    products = products.filter((product) => product.featured);
  }

  if (params.categoryId) {
    products = products.filter((product) => product.categoryId === params.categoryId);
  }

  if (search) {
    products = products.filter((product) =>
      [product.name, product.description, product.categoryName]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search)),
    );
  }

  return {
    products: products.slice(offset, offset + limit),
    total: products.length,
  };
}

export function getDemoProduct(id: number): Product | undefined {
  return demoProducts.find((product) => product.id === id);
}
