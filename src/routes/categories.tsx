import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFileRoute } from "@tanstack/react-router";
import { categoriesApi, authApi } from "@/lib/api";
import type { Category, User } from "@/lib/api";

export const Route = createFileRoute("/categories")({  
  component: CategoriesPage,
});

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
    } catch (err) {
      setError("Failed to create category");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8">
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
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Category</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  type="text"
                  placeholder="Category name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  placeholder="Category description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
