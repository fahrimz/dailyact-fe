import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { activitiesApi, categoriesApi, type Activity, type CreateActivity, type FilterActivity } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { DateTimePicker24h } from "@/components/ui/datetime-picker";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { readableDuration, readableDurationFromRange } from "@/lib/utils";

export const Route = createFileRoute("/activities")({
  beforeLoad: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return redirect({
        to: "/login",
      });
    }
  },
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [deletingActivity, setDeletingActivity] = useState<Activity | null>(null);

  const [formData, setFormData] = useState<CreateActivity>({
    description: "",
    category_id: 0,
    start_time: "",
    end_time: "",
    notes: "",
  });
  const duration = useMemo(() => readableDurationFromRange(formData.start_time, formData.end_time), [formData]);
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

  // filters
  const [filter, setFilter] = useState<FilterActivity>({});

  useEffect(() => {
    loadActivities();
    loadCategories();
  }, []);

  useEffect(() => {
    loadActivities();
  }, [filter]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activitiesApi.getActivities({ page: 1, pageSize: 100, ...filter });
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
    setFormData({ description: "", category_id: 0, start_time: "", end_time: "", notes: "" });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await activitiesApi.createActivity(formData);
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
    <div className="container mx-auto py-8 px-4">
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
          onChange={(e) => {
            setFilter(prev => ({...prev, start_date: e.target.value}))
          }}
        />
        <Select onValueChange={(value) => {
          if (value === "all") {
            setFilter(prev => ({...prev, category_id: undefined}))
            return;
          }

          setFilter(prev => ({...prev, category_id: parseInt(value)}))
        }}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
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
                    {activity.category?.name || 'No category'} • {readableDuration(activity.duration, 's')}
                  </p>
                  {activity.notes && (
                    <p className="text-gray-600 mt-1">{activity.notes}</p>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-sm font-medium">
                    {
                      new Date(activity.start_time).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                      })
                    }

                    {" - "}

                    {
                      new Date(activity.end_time).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                      })
                    }
                  </p>

                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletingActivity(activity)}
                    >
                      Delete
                  </Button>
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
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
                <span className="text-xs">Duration</span>
                <Input
                  value={duration}
                  placeholder="Duration"
                  readOnly
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
          title="Delete Activity"
          description={`Are you sure you want to delete? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => handleDelete(deletingActivity.id)}
        />
      )}
    </div>
  );
}
