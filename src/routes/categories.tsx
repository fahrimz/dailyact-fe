import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { categoriesApi, authApi } from "@/lib/api";
import type { Category, User } from "@/lib/api";
import { EditCategoryDialog } from "@/components/EditCategoryDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/categories")({  
  beforeLoad: async () => {
    const token = localStorage.getItem('token');
        
        if (!token) {
          return redirect({
            to: "/login",
          });
        }
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setCurrentUser(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load user information");
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getCategories({ page: 1, pageSize: 100 });
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setIsAddingCategory(true);
    setFormData({ name: "", description: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoriesApi.createCategory(formData);
      setIsAddingCategory(false);
      loadCategories();
      setError(null);
      toast.success("Category created successfully");
    } catch (err) {
      setError("Failed to create category");
      toast.error("Failed to create category");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        {currentUser?.role === 'admin' && (
          <Button onClick={handleAddCategory}>Add Category</Button>
        )}
      </div>

      {/* Categories List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="rounded-lg border p-6"
              >
                <h3 className="text-lg font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {category.description || "No description"}
                </p>
                {currentUser?.role === 'admin' && (
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingCategory(category)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => setDeletingCategory(category)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-center text-gray-500">No categories found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Category Form */}
      {isAddingCategory && (
        <div className="fixed p-4 inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Category description"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Category</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Dialog */}
      {editingCategory && (
        <EditCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          onSave={async (data) => {
            try {
              await categoriesApi.updateCategory(editingCategory.id, data);
              toast.success("Category updated successfully");
              loadCategories();
            } catch (err) {
              toast.error("Failed to update category");
              throw err;
            }
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingCategory && (
        <ConfirmDialog
          open={!!deletingCategory}
          onOpenChange={(open) => !open && setDeletingCategory(null)}
          title="Delete Category"
          description={`Are you sure you want to delete '${deletingCategory.name}'? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={async () => {
            try {
              await categoriesApi.deleteCategory(deletingCategory.id);
              toast.success("Category deleted successfully");
              loadCategories();
              setDeletingCategory(null);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to delete category");
            }
          }}
        />
      )}
    </div>
  );
}
