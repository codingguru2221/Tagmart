import { useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import { ArrowLeft, CreditCard, Package, RotateCcw, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/cart";
import { getDemoProduct } from "@/lib/demo-data";
import { Seo } from "@/lib/seo";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const product = getDemoProduct(productId);
  const { addToCart, clearCart } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [, setLocation] = useLocation();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-2xl font-black">Product not found</h2>
        <Button asChild>
          <Link href="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast({ title: "Added to cart!", description: `${qty}x ${product.name}` });
  };

  const handleBuyNow = () => {
    clearCart();
    addToCart(product, qty);
    setLocation("/checkout");
  };

  return (
    <div className="bg-[linear-gradient(180deg,hsl(var(--muted)/0.55),transparent_360px)]">
      <Seo
        title={`${product.name} | Buy Online at Tagmart Super Market`}
        description={`${product.description ?? product.name} Shop ${product.name} for Rs. ${product.price.toLocaleString()} at Tagmart Super Market.`}
        path={`/product/${product.id}`}
        image={product.imageUrl}
        type="product"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: product.description,
          image: product.imageUrl,
          sku: `TAG-${product.id}`,
          brand: {
            "@type": "Brand",
            name: "Tagmart",
          },
          category: product.categoryName,
          aggregateRating: product.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: 24,
              }
            : undefined,
          offers: {
            "@type": "Offer",
            url: `${window.location.origin}/product/${product.id}`,
            priceCurrency: "INR",
            price: product.price,
            availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: {
              "@type": "Organization",
              name: "Tagmart Super Market",
            },
          },
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <Link href="/shop" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative">
            <div className="overflow-hidden rounded-xl border bg-white p-3 shadow-xl shadow-black/5">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">No image</div>
                )}
              </div>
            </div>
            {discount > 0 && (
              <Badge className="absolute left-5 top-5 bg-destructive px-3 py-1 text-sm font-black text-destructive-foreground">
                {discount}% OFF
              </Badge>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-xl shadow-black/5 md:p-7">
            <div className="mb-5">
              <div className="mb-2 text-sm font-bold uppercase text-primary">{product.categoryName}</div>
              <h1 className="mb-4 text-3xl font-black leading-tight tracking-tight md:text-5xl">{product.name}</h1>
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(Number(product.rating)) ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{product.rating} customer rating</span>
                </div>
              )}
            </div>

            <div className="mb-5 flex flex-wrap items-baseline gap-3 rounded-xl bg-muted/60 p-4">
              <span className="text-4xl font-black text-primary">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>
              )}
              {discount > 0 && <Badge className="bg-secondary text-secondary-foreground">Save {discount}%</Badge>}
            </div>

            {product.description && (
              <p className="mb-5 text-base leading-8 text-muted-foreground">{product.description}</p>
            )}

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border bg-background p-3">
                <Truck className="mb-2 h-5 w-5 text-secondary" />
                <p className="text-sm font-bold">Fast delivery</p>
                <p className="text-xs text-muted-foreground">Same-day ready</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
                <p className="text-sm font-bold">Quality checked</p>
                <p className="text-xs text-muted-foreground">Verified listing</p>
              </div>
              <div className="rounded-lg border bg-background p-3">
                <RotateCcw className="mb-2 h-5 w-5 text-accent-foreground" />
                <p className="text-sm font-bold">Easy returns</p>
                <p className="text-xs text-muted-foreground">Simple support</p>
              </div>
            </div>

            <div className="mb-5 flex items-center gap-2">
              <span className="text-sm font-bold">Availability:</span>
              {product.stock > 0 ? (
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                  In Stock ({product.stock} units)
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">Out of Stock</Badge>
              )}
            </div>

            {product.stock > 0 && (
              <div className="mb-6 flex items-center gap-3">
                <span className="text-sm font-bold">Quantity:</span>
                <div className="flex items-center overflow-hidden rounded-lg border bg-background">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center font-black transition-colors hover:bg-muted"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="flex h-11 w-11 items-center justify-center font-black transition-colors hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                size="lg"
                variant="outline"
                className="h-[52px] w-full text-base font-black hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                size="lg"
                className="h-[52px] w-full text-base font-black shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {product.stock === 0 ? "Out of Stock" : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
