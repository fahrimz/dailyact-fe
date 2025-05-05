import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type User, usersApi, type FilterUser } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
});

function RouteComponent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // filters
  const [filter, setFilter] = useState<FilterUser>({
    search: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  useEffect(() => {
    if (error) {
      toast(error);
    }
  }, [error]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getUsers({
        page: 1,
        pageSize: 100,
        ...filter,
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // TODO: implement delete user
      toast.error("This feature is not implemented yet");
    } catch (err) {}
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          className="w-auto"
          placeholder="Name | Email"
          onChange={(e) => {
            setFilter((prev) => ({ ...prev, search: e.target.value }));
          }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-500">
                    {user.role[0].toUpperCase() + user.role.slice(1)} | Last
                    online at
                    {user.last_login_at
                      ? ` ${new Date(user.last_login_at).toLocaleString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                          }
                        )}`
                      : " Never"}
                  </p>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                </div>
                <div className="flex flex-col justify-between gap-3">
                  <p className="text-sm font-medium">
                    Joined{" "}
                    {new Date(user.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                    })}
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingUser(user)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>No user found</p>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingUser && (
        <ConfirmDialog
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          title="Delete User"
          description={`Are you sure you want to delete? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => handleDelete(deletingUser.id)}
        />
      )}
    </div>
  );
}
