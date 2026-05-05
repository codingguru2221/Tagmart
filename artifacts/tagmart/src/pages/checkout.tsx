import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Link } from "wouter";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [form, setForm] = useState({ address: "", phone: "" });
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  if (items.length === 0 && !success) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-40" />
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button asChild><Link href="/shop">Start Shopping</Link></Button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-2">Order Placed!</h2>
          <p className="text-muted-foreground mb-6">
            Your order #{orderId} has been placed successfully. We will contact you shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild>
              <Link href={`/order/${orderId}`}>View Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address.trim() || !form.phone.trim()) {
      toast({ title: "Missing information", description: "Please fill in address and phone number.", variant: "destructive" });
      return;
    }
    createOrder.mutate(
      {
        data: {
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          address: form.address,
          phone: form.phone,
        },
      },
      {
        onSuccess: (order) => {
          clearCart();
          setOrderId(order.id);
          setSuccess(true);
        },
        onError: () => {
          toast({ title: "Order failed", description: "Please try again.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-8">
        {/* Form */}
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-5">Delivery Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="House #, Street, Area, City"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    required
                    rows={3}
                    data-testid="input-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="03001234567"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                    data-testid="input-phone"
                  />
                </div>
                <Button type="submit" className="w-full h-12 font-bold text-base" disabled={createOrder.isPending} data-testid="button-place-order">
                  {createOrder.isPending ? "Placing Order..." : `Place Order — Rs. ${totalPrice.toLocaleString()}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="font-bold text-xl mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.name} x{item.quantity}</span>
                    <span className="font-medium shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
