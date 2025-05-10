import { Input } from "@/components/ui/input";
import {
  appFeedbacksApi,
  type AppFeedback,
  type FilterAppFeedback,
} from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/appFeedbacks")({
  component: RouteComponent,
});

function RouteComponent() {
  const [appFeedbacks, setAppFeedbacks] = useState<AppFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [filter, setFilter] = useState<FilterAppFeedback>({
    search: "",
  });

  useEffect(() => {
    loadAppFeedbacks();
  }, []);

  useEffect(() => {
    loadAppFeedbacks();
  }, [filter]);

  useEffect(() => {
    if (error) {
      toast(error);
    }
  }, [error]);

  const loadAppFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await appFeedbacksApi.getAppFeedbacks({
        page: 1,
        pageSize: 100,
        ...filter,
      });
      setAppFeedbacks(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load app feedbacks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">App Feedbacks</h1>
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
          {appFeedbacks.length > 0 ? (
            appFeedbacks.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="text-lg font-semibold">{item.user.name} | {item.user.email}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p className="text-gray-600 mt-1">{item.feedback}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No App Feedback found</p>
          )}
        </div>
      )}
    </div>
  );
}
