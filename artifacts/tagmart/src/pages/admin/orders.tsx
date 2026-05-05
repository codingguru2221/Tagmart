import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useListOrders,
  useUpdateOrderStatus,
  getListOrdersQueryKey,
} from "@workspace/api-client-react";
import { getAuthUser } from "@/lib/auth";
import { AdminLayout } from "./dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const ALL_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
type OrderStatus = typeof ALL_STATUSES[number];

export default function AdminOrders() {
  const user = getAuthUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user || user.role !== "admin") setLocation("/admin");
  }, [user, setLocation]);

  const { data, isLoading } = useListOrders(
    { limit: 50, offset: 0, status: filterStatus !== "all" ? filterStatus as OrderStatus : undefined },
    { query: { queryKey: getListOrdersQueryKey({ limit: 50, status: filterStatus !== "all" ? filterStatus as OrderStatus : undefined }) } }
  );

  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = (orderId: number, status: string) => {
    updateStatus.mutate(
      { id: orderId, data: { status: status as OrderStatus } },
      {
        onSuccess: () => {
          toast({ title: "Status updated", description: `Order #${orderId} is now ${status}` });
          qc.invalidateQueries({ queryKey: getListOrdersQueryKey({}) });
        },
        onError: () => toast({ title: "Error", description: "Failed to update status", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Orders</h1>
          <p className="text-muted-foreground mt-1">{data?.total ?? 0} total orders</p>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold">Order</th>
                    <th className="text-left px-4 py-3 font-semibold">Customer</th>
                    <th className="text-left px-4 py-3 font-semibold">Items</th>
                    <th className="text-left px-4 py-3 font-semibold">Total</th>
                    <th className="text-left px-4 py-3 font-semibold">Date</th>
                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                    <th className="text-left px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.orders?.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/20 transition-colors" data-testid={`order-row-${order.id}`}>
                      <td className="px-4 py-3 font-bold">#{order.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{order.items?.length} item(s)</td>
                      <td className="px-4 py-3 font-bold">Rs. {order.total?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(order.createdAt ?? "").toLocaleDateString("en-PK")}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs border ${STATUS_COLORS[order.status] ?? ""}`} variant="outline">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v)}>
                          <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data?.orders?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No orders found</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
