import { useEffect, useState } from "react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { activitiesApi } from "@/lib/api";
import { readableDuration } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({  
  beforeLoad: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return redirect({
        to: "/login",
      });
    }
  },
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
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalDuration = todayActivities.reduce((total, activity) => total + activity.duration, 0);

  useEffect(() => {
    setLoading(true);
    
    Promise.all([
      getRecentActivities(),
      getTodayActivities()
    ]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error && error.length > 0) {
      toast(error);
    }
  }, [error]);

  const getTodayActivities = async () => {
    try {
          const response = await activitiesApi.getActivities({ page: 1, pageSize: 100, start_date: new Date().toISOString().split('T')[0], end_date: new Date().toISOString().split('T')[0] });
          setTodayActivities(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to load activities');
        }
  }

  const getRecentActivities = async () => {
    try {
      const response = await activitiesApi.getActivities({ page: 1, pageSize: 5 });
      setRecentActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Summary Cards */}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Today's Activities</h3>
          <p className="text-3xl font-bold mt-2">{todayActivities.length}</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold">Total Time Today</h3>
          <p className="text-3xl font-bold mt-2">{
            totalDuration > 0 ? readableDuration(totalDuration, 's') : '-'
          }</p>
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
                    {activity.category.name} • {readableDuration(activity.duration, 's')}
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
