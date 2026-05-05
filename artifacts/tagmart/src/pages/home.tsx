import { Link } from "wouter";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart";

export default function Home() {
  const { data: productsData, isLoading: isLoadingProducts } = useListProducts({ featured: true, limit: 8 });
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();
  const { addToCart } = useCart();

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 max-w-4xl leading-tight">
            The bustling bazaar, <br />
            <span className="text-accent">delivered to your door.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl">
            Tagmart is your one-stop megamart for everyday needs. From fresh dal to designer shirts, find everything you need in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="h-14 px-8 text-lg font-bold" asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" asChild>
              <Link href="/shop?category=groceries">Browse Groceries</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Everything You Need</h3>
            <p className="text-sm text-muted-foreground">Thousands of products from groceries to electronics.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">Same-day delivery for all your essential items.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border">
            <div className="w-12 h-12 bg-accent/20 text-accent-foreground rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Quality Assured</h3>
            <p className="text-sm text-muted-foreground">We handpick every item to ensure top quality.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Trusted Service</h3>
            <p className="text-sm text-muted-foreground">A reliable companion for your daily shopping.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex" asChild>
            <Link href="/shop">View all <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>

        {isLoadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories?.slice(0, 6).map((category) => (
              <Link key={category.id} href={`/shop?category=${category.slug}`}>
                <Card className="hover-elevate cursor-pointer overflow-hidden border-none bg-muted/50 transition-colors hover:bg-muted">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-4 h-full justify-center aspect-square">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="w-16 h-16 object-contain mix-blend-multiply" />
                    ) : (
                      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center text-2xl">
                        📦
                      </div>
                    )}
                    <span className="font-semibold text-sm line-clamp-2">{category.name}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked favorites just for you</p>
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {productsData?.products?.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col hover-elevate">
                <div className="aspect-square bg-white relative p-4 border-b">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex flex-col flex-1">
                  <div className="text-xs text-muted-foreground mb-1">{product.categoryName}</div>
                  <h3 className="font-semibold leading-tight mb-2 flex-1 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-bold text-lg">Rs. {product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">Rs. {product.originalPrice}</span>
                    )}
                  </div>
                  <Button 
                    className="w-full" 
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product)}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
