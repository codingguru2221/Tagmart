import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import {
  useGetDashboardStats,
  useGetRecentOrders,
  useGetCategoryBreakdown,
} from "@workspace/api-client-react";
import { getAuthUser, clearAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  ShoppingBag, TrendingUp, Package, Users, Clock, CheckCircle,
  LayoutDashboard, ShoppingCart, Tag, LogOut, List,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-purple-100 text-purple-700 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-700 border-indigo-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const CHART_COLORS = ["#e8490f", "#2eab7b", "#f59e0b", "#6366f1", "#ec4899", "#14b8a6", "#8b5cf6", "#f97316"];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [pathname] = useLocation();
  const user = getAuthUser();

  const handleLogout = () => {
    clearAuth();
    setLocation("/admin");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Tag, label: "Categories", path: "/admin/categories" },
  ];

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-60 bg-foreground text-background flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-background/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-black text-lg leading-none">Tagmart</div>
              <div className="text-xs text-background/50 mt-0.5">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${pathname === item.path ? "bg-primary text-primary-foreground" : "text-background/70 hover:bg-background/10 hover:text-background"}`}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-background/10">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-background/50">Logged in as</p>
            <p className="text-sm font-semibold text-background truncate">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-background/70 hover:bg-background/10 hover:text-background transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
}

export { AdminLayout };

export default function AdminDashboard() {
  const user = getAuthUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user || user.role !== "admin") setLocation("/admin");
  }, [user, setLocation]);

  const { data: stats } = useGetDashboardStats();
  const { data: recentOrders } = useGetRecentOrders();
  const { data: categoryBreakdown } = useGetCategoryBreakdown();

  if (!user) return null;

  const statCards = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Revenue", value: `Rs. ${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Products", value: stats?.totalProducts ?? 0, icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Total Customers", value: stats?.totalCustomers ?? 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Orders", value: stats?.pendingOrders ?? 0, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Delivered", value: stats?.deliveredOrders ?? 0, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Today's Orders", value: stats?.todayOrders ?? 0, icon: List, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Today's Revenue", value: `Rs. ${(stats?.todayRevenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user.name}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
                <p className="font-black text-xl truncate">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryBreakdown ?? []} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="categoryName" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `Rs. ${v.toLocaleString()}`} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {(categoryBreakdown ?? []).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders?.slice(0, 6).map((order) => (
              <div key={order.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                <div>
                  <p className="font-semibold">#{order.id} — {order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt ?? "").toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Rs. {order.total?.toLocaleString()}</span>
                  <Badge className={`text-xs border ${STATUS_COLORS[order.status] ?? ""}`} variant="outline">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
