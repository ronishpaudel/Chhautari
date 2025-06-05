"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const jobCategories = [
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "CLEANING", label: "Cleaning" },
  { value: "TUTORING", label: "Tutoring" },
  { value: "GARDENING", label: "Gardening" },
  { value: "COOKING", label: "Cooking" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "REPAIR", label: "Repair" },
  { value: "PAINTING", label: "Painting" },
  { value: "OTHER", label: "Other" },
];

export function CreateJobForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    isUrgent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement job creation API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Job posted successfully!",
        description: "Your job has been posted to the community.",
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        isUrgent: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Job Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g., Math Tutor Needed"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the job requirements, timeline, and any specific details..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (NPR)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="e.g., 5000"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={formData.isUrgent}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isUrgent: checked as boolean })
                }
              />
              <Label htmlFor="urgent">This is an urgent job</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Save as Draft
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
