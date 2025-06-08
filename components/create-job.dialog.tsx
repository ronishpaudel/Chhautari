import { useState } from "react";
import { Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModalDialog } from "./modal-dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function CreateJobDialog({
  onCreate,
}: {
  onCreate: (
    title: string,
    description: string,
    category?: string,
    location?: string,
    budget?: number
  ) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: "Required fields missing", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreate(
        title,
        description,
        category || undefined,
        location || undefined,
        typeof budget === "number" ? budget : undefined
      );
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setBudget("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create job.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalDialog
      triggerLabel="Post Job"
      triggerIcon={<Briefcase className="h-5 w-5 text-green-600" />}
      title="Create New Job"
      description="Post a job for your community to apply to."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      triggerVariant="outline"
      triggerClassName="hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          placeholder="e.g., Math Tutor Needed"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the job requirements..."
          className="min-h-[120px] resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category (Optional)</Label>
        <Select onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TUTORING">Tutoring</SelectItem>
            <SelectItem value="REPAIR">Repair</SelectItem>
            <SelectItem value="SERVICES">Services</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
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
      <div className="space-y-2">
        <Label htmlFor="budget">Budget (Optional)</Label>
        <Input
          id="budget"
          type="number"
          min={0}
          placeholder="Enter budget in NPR"
          value={budget}
          onChange={(e) => {
            const val = e.target.value;
            setBudget(val === "" ? "" : Number(val));
          }}
        />
      </div>
    </ModalDialog>
  );
}
