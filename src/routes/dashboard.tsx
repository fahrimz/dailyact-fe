import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({  
  component: DashboardPage,
});

interface Activity {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  description: string;
  category: {
    name: string;
  };
}

function DashboardPage() {
  const [recentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch recent activities from the backend
    // This will be implemented when the backend endpoint is ready
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Today's Activities</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Total Time Today</h3>
          <p className="text-3xl font-bold mt-2">0h 0m</p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Active Categories</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>
        {loading ? (
          <p>Loading...</p>
        ) : recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-semibold">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {activity.category.name} • {activity.duration} minutes
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent activities</p>
        )}
      </div>
    </div>
  );
}
