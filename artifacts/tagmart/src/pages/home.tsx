import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  HeartHandshake,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { demoCategoriesWithCounts, listDemoProducts } from "@/lib/demo-data";
import { useToast } from "@/hooks/use-toast";
import { organizationJsonLd, Seo, websiteJsonLd } from "@/lib/seo";

const featureHighlights = [
  {
    icon: ShoppingBag,
    title: "Everything in One Cart",
    copy: "Groceries, fashion, home care, beauty, and gadgets in one smooth storefront.",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: Truck,
    title: "Fast Local Delivery",
    copy: "Built for quick city delivery with a checkout flow customers can trust.",
    tone: "bg-secondary/10 text-secondary",
  },
  {
    icon: ShieldCheck,
    title: "Quality First",
    copy: "Clean product presentation, sale badges, stock states, and clear pricing.",
    tone: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: HeartHandshake,
    title: "Customer Ready",
    copy: "Designed for repeat shopping with simple navigation and cart actions.",
    tone: "bg-destructive/10 text-destructive",
  },
];

export default function Home() {
  const productsData = listDemoProducts({ featured: true, limit: 8 });
  const categoryList = demoCategoriesWithCounts;
  const { addToCart, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return (
    <div className="flex flex-col pb-16">
      <Seo
        title="Tagmart Super Market | Online Megamart for Groceries, Fashion & Electronics"
        description="Shop groceries, fashion, electronics, beauty, home care, stationery, and daily essentials online with Tagmart Super Market."
        path="/"
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />
      <section className="relative overflow-hidden bg-foreground text-background">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,23,21,0.94)_0%,rgba(28,23,21,0.78)_44%,rgba(28,23,21,0.28)_100%)]" />

        <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 pb-16 pt-14 md:pb-20 md:pt-16 lg:min-h-[680px] lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.8fr)] xl:gap-16">
          <div className="max-w-3xl self-center">
            <Badge className="mb-5 border-white/15 bg-white/10 text-white hover:bg-white/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Premium demo storefront
            </Badge>
            <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl xl:text-7xl">
              Tagmart brings the whole bazaar to one beautiful checkout.
            </h1>
            <p className="mb-8 max-w-2xl text-base leading-8 text-white/82 md:text-xl">
              A polished online supermarket experience for daily essentials, trending products, fast delivery, and confident repeat shopping.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-[52px] px-7 text-base font-bold shadow-xl shadow-primary/25" asChild>
                <Link href="/shop">
                  Start Shopping <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-[52px] border-white/25 bg-white/10 px-7 text-base font-bold text-white hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/shop?category=groceries">Browse Groceries</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 divide-x divide-white/15 rounded-xl border border-white/15 bg-white/10 backdrop-blur">
              <div className="p-4">
                <div className="text-2xl font-black text-white">10+</div>
                <div className="text-xs font-medium text-white/70">Demo products</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">6</div>
                <div className="text-xs font-medium text-white/70">Categories</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-black text-white">4.6</div>
                <div className="text-xs font-medium text-white/70">Avg rating</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex lg:justify-end">
            <div className="w-full max-w-sm rounded-xl border border-white/15 bg-white/95 p-4 text-foreground shadow-2xl xl:max-w-md">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Today's basket</p>
                  <h2 className="text-xl font-black">Ready for delivery</h2>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <PackageCheck className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-3">
                {productsData.products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                    <img src={product.imageUrl} alt={product.name} className="h-14 w-14 rounded-md bg-white object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                    </div>
                    <p className="text-sm font-black">Rs. {product.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-secondary/10 p-3 text-sm font-semibold text-secondary">
                <Clock3 className="h-4 w-4" />
                Same-day delivery experience
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {featureHighlights.map((feature) => (
            <div key={feature.title} className="rounded-xl border bg-card p-5 shadow-lg shadow-black/5">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${feature.tone}`}>
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-bold">{feature.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{feature.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-primary">Explore departments</p>
            <h2 className="text-3xl font-black tracking-tight">Shop by Category</h2>
            <p className="mt-2 text-muted-foreground">Clear, image-led categories make browsing feel effortless.</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex" asChild>
            <Link href="/shop">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categoryList.slice(0, 6).map((category) => (
            <Link key={category.id} href={`/shop?category=${category.slug}`}>
              <Card className="group h-full overflow-hidden border-card-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={category.imageUrl} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold">{category.name}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{category.productCount}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pt-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase text-secondary">Client-ready catalog</p>
            <h2 className="text-3xl font-black tracking-tight">Featured Products</h2>
            <p className="mt-2 text-muted-foreground">Demo items with real pricing, sale states, stock, and ratings.</p>
          </div>
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link href="/shop">Open full shop</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          {productsData.products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-card-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square overflow-hidden bg-white p-3">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">No image</div>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge className="absolute left-3 top-3 bg-destructive text-destructive-foreground">SALE</Badge>
                  )}
                  {product.rating && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-bold shadow">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {product.rating}
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="flex min-h-44 flex-col p-4">
                <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">{product.categoryName}</div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="line-clamp-2 min-h-10 font-bold leading-tight transition-colors hover:text-primary">{product.name}</h3>
                </Link>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-black">Rs. {product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="w-full font-bold hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
                    disabled={product.stock === 0}
                    onClick={() => {
                      addToCart(product);
                      toast({ title: "Added to cart", description: product.name });
                    }}
                  >
                    {product.stock > 0 && <ShoppingCart className="h-4 w-4" />}
                    Cart
                  </Button>
                  <Button
                    className="w-full font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
                    disabled={product.stock === 0}
                    onClick={() => {
                      clearCart();
                      addToCart(product);
                      setLocation("/checkout");
                    }}
                  >
                    {product.stock > 0 && <CreditCard className="h-4 w-4" />}
                    {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
