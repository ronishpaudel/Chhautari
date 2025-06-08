"use client";

import React, { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Vote, Send, Loader2, Plus, Trash2 } from "lucide-react";
import { ModalDialog } from "./modal-dialog"; // Your reusable dialog component
import { useToast } from "@/hooks/use-toast";

interface CreatePollDialogProps {
  onCreate: (
    question: string,
    options: string[],
    expiresAt?: string
  ) => Promise<void>;
}

export function CreatePollDialog({ onCreate }: CreatePollDialogProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", ""]); // Start with 3 empty options
  const [expiresAt, setExpiresAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions[index] = value;
      return newOptions;
    });
  };

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({ title: "Question required", variant: "destructive" });
      return;
    }
    if (options.some((opt) => !opt.trim()) || options.length < 2) {
      toast({
        title: "Options required",
        description: "Please provide at least two non-empty options.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await onCreate(
        question,
        options.filter((opt) => opt.trim()),
        expiresAt || undefined
      );
      setQuestion("");
      setOptions(["", "", ""]);
      setExpiresAt("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to create poll.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalDialog
      triggerLabel="Create Poll"
      triggerIcon={<Vote className="h-5 w-5 text-purple-600" />}
      title="Create New Poll"
      description="Create a poll to engage your community."
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      triggerVariant="outline"
      triggerClassName="hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question">Question</Label>
          <Input
            id="question"
            placeholder="e.g., Should we organize a cleanup drive?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Options</Label>
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              {options.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                  aria-label={`Remove option ${index + 1}`}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add Option</span>
          </Button>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="expiresAt">Expiration (Optional)</Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div> */}
      </div>
    </ModalDialog>
  );
}
