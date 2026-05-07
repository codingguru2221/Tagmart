import { useParams, Link } from "wouter";
import { useGetOrder, getGetOrderQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Store, Truck } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const FULFILLMENT_LABELS: Record<string, string> = {
  delivery: "Home delivery",
  pickup: "Pick up from store",
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, isLoading } = useGetOrder(orderId, {
    query: { enabled: !!orderId, queryKey: getGetOrderQueryKey(orderId) },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="h-8 w-32 bg-muted rounded animate-pulse mb-6" />
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button asChild><Link href="/orders">My Orders</Link></Button>
      </div>
    );
  }

  const currentStep = STATUS_STEPS.indexOf(order.status);
  const fulfillmentMethod = order.fulfillmentMethod ?? "delivery";
  const isPickup = fulfillmentMethod === "pickup";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> My Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <Badge className={`text-sm border px-3 py-1 ${STATUS_COLORS[order.status] ?? ""}`} variant="outline">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      {/* Progress bar */}
      {order.status !== "cancelled" && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
              <div
                className="absolute top-4 left-0 h-0.5 bg-primary transition-all"
                style={{ width: `${currentStep > 0 ? (currentStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
              />
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${i <= currentStep ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground/30 text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground capitalize hidden sm:block">
                    {isPickup && step === "shipped" ? "ready" : step}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-contain rounded-lg border bg-white p-1" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                  </div>
                  <span className="text-sm font-bold shrink-0">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rs. {order.total?.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Fulfillment info */}
        <Card>
          <CardContent className="p-6">
            <h2 className="font-bold text-lg mb-4">Fulfillment Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
                {isPickup ? <Store className="mt-0.5 h-4 w-4 text-primary" /> : <Truck className="mt-0.5 h-4 w-4 text-primary" />}
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Method</p>
                  <p className="font-medium">{FULFILLMENT_LABELS[fulfillmentMethod] ?? "Home delivery"}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Customer</p>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-muted-foreground">{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                  {isPickup ? "Pickup" : "Delivery Address"}
                </p>
                <p className="font-medium">{order.address}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Phone</p>
                <p className="font-medium">{order.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt ?? "").toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
