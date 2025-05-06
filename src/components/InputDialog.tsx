import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InputDialogProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => Promise<void>;
  loading?: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export function InputDialog({
  title,
  open,
  onOpenChange,
  onSave,
  loading = false,
  error = null,
  children,
}: InputDialogProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {children}
          
          {error && (
            <div className="text-sm text-destructive">{error}</div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
