import { useState } from "react";
import { useSearch } from "wouter";
import { useListProducts, useListCategories, getListProductsQueryKey } from "@workspace/api-client-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Link } from "wouter";

export default function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initCategory = params.get("category") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initCategory);

  const { data: categories } = useListCategories();
  const { data: productsData, isLoading } = useListProducts(
    {
      search: searchTerm || undefined,
      categoryId: selectedCategory ? categories?.find((c) => c.slug === selectedCategory)?.id : undefined,
      limit: 48,
      offset: 0,
    },
    { query: { queryKey: getListProductsQueryKey({ search: searchTerm, categoryId: categories?.find((c) => c.slug === selectedCategory)?.id }) } }
  );
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border rounded-2xl p-5 sticky top-4">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-4 h-4" />
              <h2 className="font-bold">Filter by Category</h2>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === "" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
              >
                All Products
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${selectedCategory === cat.slug ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"}`}
                  data-testid={`filter-category-${cat.slug}`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-xs ${selectedCategory === cat.slug ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">
                {selectedCategory ? categories?.find((c) => c.slug === selectedCategory)?.name ?? "Products" : "All Products"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {productsData?.total ?? 0} products found
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : productsData?.products?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No products found</p>
              <p className="text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsData?.products?.map((product) => (
                <Card key={product.id} className="overflow-hidden flex flex-col hover-elevate group" data-testid={`card-product-${product.id}`}>
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square bg-white relative p-3 border-b overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">No image</div>
                      )}
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">SALE</Badge>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                          <Badge variant="outline" className="font-bold">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                  <CardContent className="p-3 flex flex-col flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{product.categoryName}</div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-sm leading-tight mb-2 flex-1 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="font-bold text-sm">Rs. {product.price?.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">Rs. {product.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full text-xs"
                      disabled={product.stock === 0}
                      onClick={() => addToCart(product)}
                      data-testid={`button-add-to-cart-${product.id}`}
                    >
                      {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
