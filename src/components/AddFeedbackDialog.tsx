import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { appFeedbacksApi } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";

export function AddFeedbackDialog() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [open, setOpen] = useState(false);
  const onOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setFeedback("");
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user) {
      setError("Please login again to continue");
      return;
    }

    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await appFeedbacksApi.createAppFeedback({
        feedback,
      });

      setFeedback("");
      toast.success("Feedback submitted successfully");
      onOpenChange(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => onOpenChange(true)}
        className="w-full sm:w-auto fixed bottom-4 right-4 sm:bottom-8 sm:right-8 shadow-lg"
      >
        Give Feedback
      </Button>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Any bug? error? or just want to pour your heart out?</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter anything"
                required
              />
            </div>
            {error && <div className="text-sm text-destructive">{error}</div>}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Send Feedback"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
