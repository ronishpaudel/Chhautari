"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, DollarSign, Users, Plus, Filter } from "lucide-react";
import Link from "next/link";

export function JobsSection() {
  const jobs = [
    {
      id: 1,
      title: "Math Tutor Needed",
      description:
        "Looking for an experienced math tutor for Grade 10 student. 3 sessions per week.",
      category: "TUTORING",
      budget: 5000,
      location: "Patan",
      isUrgent: false,
      status: "OPEN",
      postedBy: {
        name: "Sita Poudel",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: false,
      },
      applications: 8,
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      title: "Plumbing Repair - Urgent",
      description: "Kitchen sink is leaking badly. Need immediate repair.",
      category: "PLUMBING",
      budget: 2000,
      location: "Thamel",
      isUrgent: true,
      status: "OPEN",
      postedBy: {
        name: "Ram Bahadur",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      applications: 12,
      timestamp: "4 hours ago",
    },
    {
      id: 3,
      title: "House Cleaning Service",
      description: "Weekly house cleaning service needed. 3-bedroom apartment.",
      category: "CLEANING",
      budget: 3000,
      location: "Lalitpur",
      isUrgent: false,
      status: "OPEN",
      postedBy: {
        name: "Maya Gurung",
        avatar: "/placeholder.svg?height=40&width=40",
        isVerified: true,
      },
      applications: 5,
      timestamp: "1 day ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button asChild>
          <Link href="/dashboard/jobs/create">
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Link>
        </Button>
      </div>

      {/* Job Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Jobs</TabsTrigger>
          <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
          <TabsTrigger value="plumbing">Plumbing</TabsTrigger>
          <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
          <TabsTrigger value="electrical">Electrical</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      {job.isUrgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        NPR {job.budget}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.timestamp}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{job.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {job.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={job.postedBy.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {job.postedBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {job.postedBy.name}
                        </span>
                        {job.postedBy.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {job.applications} applications
                    </div>
                    <Button>Apply Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
