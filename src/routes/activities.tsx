import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import { activitiesApi, categoriesApi } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DateTimePicker24h } from "@/components/ui/datetime-picker";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export const Route = createFileRoute("/activities")({
  component: ActivitiesPage,
});

interface Activity {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  description: string;
  notes: string;
  category_id: number;
  category: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

function ActivitiesPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: 0,
    start_time: "",
    end_time: "",
    notes: "",
  });
  const duration = useMemo(() => {
    return formData.end_time ? new Date(formData.end_time).getTime() - new Date(formData.start_time).getTime() : 0;
  }, [formData]);
  const durationInMinute = duration / 1000 / 60;
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

  useEffect(() => {
    loadActivities();
    loadCategories();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activitiesApi.getActivities({ page: 1, pageSize: 100 });
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesApi.getCategories({ page: 1, pageSize: 100 });
      setCategories(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await activitiesApi.deleteActivity(id);
      loadActivities();
    } catch (err) {
    }
  };

  const handleAddActivity = () => {
    setIsAddingActivity(true);
    setFormData({ name: "", description: "", category_id: 0, start_time: "", end_time: "", notes: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const duration = new Date(formData.end_time).getTime() - new Date(formData.start_time).getTime();
      await activitiesApi.createActivity({ ...formData, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), duration });
      setIsAddingActivity(false);
      loadActivities();
      setError(null);
      toast.success("Activity created successfully");
    } catch (err) {
      setError("Failed to create activity");
      toast.error("Failed to create activity");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Activities</h1>
        <div className="flex gap-4">
          <div className="flex rounded-md shadow-sm">
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className="rounded-l-md rounded-r-none"
            >
              List
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              onClick={() => setView("calendar")}
              className="rounded-l-none rounded-r-md"
            >
              Calendar
            </Button>
          </div>
          <Button onClick={handleAddActivity}>Add Activity</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Input
          type="date"
          className="w-auto"
        />
        <Select onValueChange={(value) => console.log(value)}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activities List/Calendar View */}
      {loading ? (
        <p>Loading...</p>
      ) : view === 'list' ? (
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="text-lg font-semibold">{activity.description}</p>
                  <p className="text-xs text-gray-500">
                    {activity.category?.name || 'No category'} • {activity.duration / 1000 / 60} minutes
                  </p>
                  {activity.notes && (
                    <p className="text-gray-600 mt-1">{activity.notes}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-sm font-medium">
                    {new Date(activity.start_time).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingActivity(activity)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No activities found</p>
          )}
        </div>
      ) : (
        <p>Calendar view coming soon</p>
      )}

      {/* Add Activity Form */}
      {isAddingActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Activity name"
                  required
                />
              </div>
              <Select onValueChange={(e) => setFormData({ ...formData, category_id: parseInt(e) })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-row gap-2">
                <div>
                  <span className="text-xs">Time Start</span>
                  <DateTimePicker24h onDateSelected={date => setFormData({ ...formData, start_time: date.toISOString() })} />
                </div>
                <div>
                  <span className="text-xs">Time End</span>
                  <DateTimePicker24h onDateSelected={date => setFormData({ ...formData, end_time: date.toISOString() })} />
                </div>
              </div>
              <div>
                <span className="text-xs">Duration (in minute)</span>
                <Input
                  value={durationInMinute}
                  type="number"
                  placeholder="Duration"
                  readOnly
                />
              </div>
              <div>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Activity description"
                  required
                />
              </div>
              <div>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Activity notes"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingActivity(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Activity</Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      {deletingActivity && (
        <ConfirmDialog
          open={!!deletingActivity}
          onOpenChange={(open) => !open && setDeletingActivity(null)}
          title="Delete Category"
          description={`Are you sure you want to delete? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => handleDelete(deletingActivity.id)}
        />
      )}
    </div>
  );
}
