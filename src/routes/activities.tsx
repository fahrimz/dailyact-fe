import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";

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
  category: {
    id: number;
    name: string;
  };
}

function ActivitiesPage() {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [activities] = useState<Activity[]>([]);
  const [loading] = useState(true);

  const handleAddActivity = () => {
    // TODO: Implement activity creation modal
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
        <Select>
          <option value="">All Categories</option>
          {/* TODO: Add categories */}
        </Select>
      </div>

      {/* Activities List/Calendar View */}
      {loading ? (
        <p>Loading...</p>
      ) : view === "list" ? (
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-semibold">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {activity.category.name} • {activity.duration} minutes
                  </p>
                  {activity.notes && (
                    <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.start_time).toLocaleTimeString()} -{" "}
                    {new Date(activity.end_time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No activities found</p>
          )}
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          {/* TODO: Implement calendar view */}
          <p className="text-center text-gray-500">Calendar view coming soon</p>
        </div>
      )}
    </div>
  );
}
