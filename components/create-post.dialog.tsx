import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModalDialog } from "./modal-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function CreatePostDialog({
  onCreate,
}: {
  onCreate: (content: string, location?: string) => Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({ title: "Content required", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreate(content, location || undefined);
      setContent("");
      setLocation("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalDialog
      triggerLabel="Create Post"
      triggerIcon={<Plus className="h-5 w-5" />}
      title="Create New Post"
      description="Share something with your community. What's on your mind?"
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="What's happening in your neighborhood?"
          className="min-h-[120px] resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location (Optional)</Label>
        <Input
          id="location"
          placeholder="Specific location or landmark"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
    </ModalDialog>
  );
}
