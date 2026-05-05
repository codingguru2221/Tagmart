import { useListOrders } from "@workspace/api-client-react";
import { getAuthUser } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function Orders() {
  const user = getAuthUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) setLocation("/login");
  }, [user, setLocation]);

  const { data, isLoading } = useListOrders({ limit: 20, offset: 0 });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : data?.orders?.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">Start shopping to place your first order</p>
          <Button asChild><Link href="/shop">Browse Products</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.orders?.map((order) => (
            <Card key={order.id} data-testid={`order-card-${order.id}`}>
              <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold">Order #{order.id}</span>
                    <Badge className={`text-xs border ${STATUS_COLORS[order.status] ?? ""}`} variant="outline">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {order.items?.length} item(s) — {new Date(order.createdAt ?? "").toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{order.address}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">Rs. {order.total?.toLocaleString()}</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/order/${order.id}`}>
                      View <ArrowRight className="w-3 h-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
