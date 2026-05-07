import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Search, ShoppingCart, SlidersHorizontal, Sparkles, Star } from "lucide-react";
import { Link } from "wouter";
import { demoCategoriesWithCounts, listDemoProducts } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/lib/seo";

export default function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initCategory = params.get("category") || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initCategory);

  const categoryList = demoCategoriesWithCounts;
  const selectedCategoryId = selectedCategory ? categoryList.find((c) => c.slug === selectedCategory)?.id : undefined;
  const productsData = listDemoProducts({
    search: searchTerm || undefined,
    categoryId: selectedCategoryId,
    limit: 48,
    offset: 0,
  });
  const isLoading = false;
  const { addToCart, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const pageTitle = selectedCategory ? categoryList.find((c) => c.slug === selectedCategory)?.name ?? "Products" : "All Products";

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={`${pageTitle} | Shop Online at Tagmart Super Market`}
        description={`Browse ${pageTitle.toLowerCase()} at Tagmart Super Market. Compare products, prices, discounts, ratings, and availability before checkout.`}
        path={selectedCategory ? `/shop?category=${selectedCategory}` : "/shop"}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${pageTitle} - Tagmart Super Market`,
          description: `Online shopping collection for ${pageTitle.toLowerCase()} at Tagmart Super Market.`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: productsData.products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${window.location.origin}/product/${product.id}`,
              name: product.name,
            })),
          },
        }}
      />
      <div className="mb-8 overflow-hidden rounded-xl border bg-foreground text-background shadow-xl">
        <div className="relative px-5 py-8 md:px-8">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <Badge className="mb-3 border-white/15 bg-white/10 text-white hover:bg-white/10">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Curated demo catalog
              </Badge>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {selectedCategory ? categoryList.find((c) => c.slug === selectedCategory)?.name ?? "Products" : "All Products"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                Browse polished product cards with real pricing, ratings, sale labels, and stock states.
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold backdrop-blur">
              {productsData.total} products found
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border rounded-xl p-5 sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <SlidersHorizontal className="w-4 h-4" />
              <h2 className="font-bold">Filter by Category</h2>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedCategory === "" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground"}`}
              >
                All Products
              </button>
              {categoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors flex justify-between items-center ${selectedCategory === cat.slug ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground"}`}
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
              <h2 className="text-2xl font-black">
                {selectedCategory ? categoryList.find((c) => c.slug === selectedCategory)?.name ?? "Products" : "All Products"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {productsData?.total ?? 0} products found
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="h-11 rounded-full bg-card pl-9 shadow-sm"
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
                <Card key={product.id} className="overflow-hidden flex flex-col group border-card-border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" data-testid={`card-product-${product.id}`}>
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-square bg-white relative p-3 border-b overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full rounded-lg object-cover group-hover:scale-105 transition-transform duration-500" />
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
                  <CardContent className="p-3 flex min-h-[168px] flex-col flex-1">
                    <div className="text-xs font-medium uppercase text-muted-foreground mb-1">{product.categoryName}</div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-sm leading-tight mb-2 min-h-9 line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                    </Link>
                    {product.rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="font-black text-sm">Rs. {product.price?.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">Rs. {product.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                    <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs font-bold hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
                        disabled={product.stock === 0}
                        onClick={() => {
                          addToCart(product);
                          toast({ title: "Added to cart", description: product.name });
                        }}
                        data-testid={`button-add-to-cart-${product.id}`}
                      >
                        {product.stock > 0 && <ShoppingCart className="h-3.5 w-3.5" />}
                        Cart
                      </Button>
                      <Button
                        size="sm"
                        className="w-full text-xs font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
                        disabled={product.stock === 0}
                        onClick={() => {
                          clearCart();
                          addToCart(product);
                          setLocation("/checkout");
                        }}
                      >
                        {product.stock > 0 && <CreditCard className="h-3.5 w-3.5" />}
                        {product.stock === 0 ? "Out" : "Buy Now"}
                      </Button>
                    </div>
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
