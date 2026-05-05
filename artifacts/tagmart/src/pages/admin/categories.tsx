import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  useListCategories,
  useCreateCategory,
  useDeleteCategory,
  getListCategoriesQueryKey,
} from "@workspace/api-client-react";
import { getAuthUser } from "@/lib/auth";
import { AdminLayout } from "./dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Tag } from "lucide-react";

type CatForm = { name: string; slug: string; description: string; imageUrl: string };
const emptyForm: CatForm = { name: "", slug: "", description: "", imageUrl: "" };

export default function AdminCategories() {
  const user = getAuthUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CatForm>(emptyForm);

  useEffect(() => {
    if (!user || user.role !== "admin") setLocation("/admin");
  }, [user, setLocation]);

  const { data: categories, isLoading } = useListCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleChange = (field: keyof CatForm, value: string) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === "name") updated.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast({ title: "Missing fields", description: "Name and slug are required.", variant: "destructive" });
      return;
    }
    createCategory.mutate(
      { data: { name: form.name, slug: form.slug, description: form.description || undefined, imageUrl: form.imageUrl || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Category created!" });
          setForm(emptyForm);
          setOpen(false);
          qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        },
        onError: () => toast({ title: "Error", description: "Failed to create category", variant: "destructive" }),
      }
    );
  };

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category may be affected.`)) return;
    deleteCategory.mutate(
      { id },
      {
        onSuccess: () => {
          toast({ title: "Deleted", description: `Category "${name}" removed.` });
          qc.invalidateQueries({ queryKey: getListCategoriesQueryKey() });
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">Categories</h1>
          <p className="text-muted-foreground mt-1">{categories?.length ?? 0} categories</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-category"><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Category Name *</Label>
                <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. Electronics" required data-testid="input-category-name" />
              </div>
              <div className="space-y-1">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => handleChange("slug", e.target.value)} placeholder="electronics" required data-testid="input-slug" />
                <p className="text-xs text-muted-foreground">Auto-generated from name. Used in URLs.</p>
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Short description..." />
              </div>
              <div className="space-y-1">
                <Label>Image URL</Label>
                <Input value={form.imageUrl} onChange={(e) => handleChange("imageUrl", e.target.value)} placeholder="https://..." />
              </div>
              <Button type="submit" className="w-full" disabled={createCategory.isPending}>
                {createCategory.isPending ? "Creating..." : "Create Category"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-36 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories?.map((cat) => (
            <Card key={cat.id} className="overflow-hidden" data-testid={`category-card-${cat.id}`}>
              <div className="h-28 bg-muted overflow-hidden relative">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-8 h-8 text-muted-foreground opacity-40" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-background/80 text-destructive hover:text-destructive hover:bg-background/90 w-8 h-8 p-0"
                  onClick={() => handleDelete(cat.id, cat.name)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <CardContent className="p-4">
                <p className="font-bold line-clamp-1">{cat.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.productCount} products</p>
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">/{cat.slug}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
