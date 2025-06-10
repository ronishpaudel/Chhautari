"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { createJob, createPost, fetchJobs } from "@/lib/feed-api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { EnhancedJobCard, Post } from "./feed-cards";
import { CreateJobDialog } from "./create-job.dialog";

function JobCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="flex items-start justify-between space-x-4">
          <div className="space-y-2 flex-1">
            <div className="h-6 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="flex space-x-4 text-sm text-muted-foreground">
              <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-12 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
          <div className="h-6 w-20 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-12 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 bg-gray-300 dark:bg-gray-700" />
            <div className="space-y-1">
              <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
              <div className="h-3 w-12 rounded bg-gray-300 dark:bg-gray-700" />
            </div>
          </div>
          <div className="h-8 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );
}

function JobsSection() {
  const [jobs, setJobs] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const filteredJobs =
    selectedCategory === "all"
      ? jobs
      : jobs.filter(
          (job) =>
            job.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, idx) => (
          <JobCardSkeleton key={idx} />
        ))}
      </div>
    );
  }
  const handleCreateJob = async (
    title: string,
    description: string,
    category?: string,
    location?: string
  ) => {
    await createJob({
      title,
      description,
      category,
      location,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <CreateJobDialog onCreate={handleCreateJob} />
      </div>

      {/* Job Categories */}
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => setSelectedCategory(value)}
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="TUTORING">Tutoring</TabsTrigger>
          <TabsTrigger value="REPAIR">Repairing</TabsTrigger>
          <TabsTrigger value="SERVICES">Services</TabsTrigger>
          <TabsTrigger value="OTHER">Other</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4 mt-6">
          {filteredJobs.length === 0 ? (
            <p>No jobs found in this category.</p>
          ) : (
            filteredJobs.map((job) => (
              <EnhancedJobCard key={job.id} post={job} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
export { JobCardSkeleton, JobsSection };
