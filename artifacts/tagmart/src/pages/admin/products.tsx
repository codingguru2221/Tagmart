import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useListProducts,
  useCreateProduct,
  useDeleteProduct,
  useListCategories,
  getListProductsQueryKey,
} from "@workspace/api-client-react";
import { getAuthUser } from "@/lib/auth";
import { AdminLayout } from "./dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Package } from "lucide-react";

type ProductForm = {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  imageUrl: string;
  stock: string;
  categoryId: string;
  featured: boolean;
};

const emptyForm: ProductForm = {
  name: "", description: "", price: "", originalPrice: "",
  imageUrl: "", stock: "", categoryId: "", featured: false,
};

export default function AdminProducts() {
  const user = getAuthUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  useEffect(() => {
    if (!user || user.role !== "admin") setLocation("/admin");
  }, [user, setLocation]);

  const { data, isLoading } = useListProducts({ limit: 100, offset: 0 });
  const { data: categories } = useListCategories();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const handleChange = (field: keyof ProductForm, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock || !form.categoryId) {
      toast({ title: "Missing fields", description: "Name, price, stock, and category are required.", variant: "destructive" });
      return;
    }
    createProduct.mutate(
      {
        data: {
          name: form.name,
          description: form.description || undefined,
          price: Number(form.price),
          originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
          imageUrl: form.imageUrl || undefined,
          stock: Number(form.stock),
          categoryId: Number(form.categoryId),
          featured: form.featured,
        },
      },
      {
        onSuccess: () => {
          toast({ title: "Product created!" });
          setForm(emptyForm);
          setOpen(false);
          qc.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
        },
        onError: () => toast({ title: "Error", description: "Failed to create product", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    deleteProduct.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Deleted", description: `"${name}" has been removed.` });
          qc.invalidateQueries({ queryKey: getListProductsQueryKey({}) });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Products</h1>
          <p className="text-muted-foreground mt-1">{data?.total ?? 0} products</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-product">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Product Name *</Label>
                <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Basmati Rice 5kg" required data-testid="input-product-name" />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Product description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Price (Rs.) *</Label>
                  <Input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} placeholder="850" required data-testid="input-price" />
                </div>
                <div className="space-y-1">
                  <Label>Original Price (Rs.)</Label>
                  <Input type="number" value={form.originalPrice} onChange={(e) => handleChange("originalPrice", e.target.value)} placeholder="950" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Stock *</Label>
                  <Input type="number" value={form.stock} onChange={(e) => handleChange("stock", e.target.value)} placeholder="100" required data-testid="input-stock" />
                </div>
                <div className="space-y-1">
                  <Label>Category *</Label>
                  <Select value={form.categoryId} onValueChange={(v) => handleChange("categoryId", v)}>
                    <SelectTrigger data-testid="select-category"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      {categories?.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Image URL</Label>
                <Input value={form.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => handleChange("featured", e.target.checked)} className="w-4 h-4 rounded" />
                <Label htmlFor="featured">Featured product</Label>
              </div>
              <Button type="submit" className="w-full" disabled={createProduct.isPending}>
                {createProduct.isPending ? "Creating..." : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 font-semibold">Product</th>
                    <th className="text-left px-4 py-3 font-semibold">Category</th>
                    <th className="text-left px-4 py-3 font-semibold">Price</th>
                    <th className="text-left px-4 py-3 font-semibold">Stock</th>
                    <th className="text-left px-4 py-3 font-semibold">Featured</th>
                    <th className="text-left px-4 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.products?.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-muted/20 transition-colors" data-testid={`product-row-${p.id}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 object-contain rounded-lg border bg-white p-1" />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium line-clamp-1 max-w-48">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{p.categoryName}</td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-bold">Rs. {p.price?.toLocaleString()}</span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-xs text-muted-foreground line-through ml-1">Rs. {p.originalPrice?.toLocaleString()}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={p.stock === 0 ? "text-red-600 border-red-200 bg-red-50" : "text-green-600 border-green-200 bg-green-50"}>
                          {p.stock === 0 ? "Out of Stock" : `${p.stock} units`}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {p.featured && <Badge className="bg-primary text-primary-foreground text-xs">Featured</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(p.id, p.name)}
                          data-testid={`button-delete-${p.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data?.products?.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No products yet</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
