import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Individual post skeleton component
export function PostSkeleton() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar skeleton */}
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              {/* Name skeleton */}
              <Skeleton className="h-4 w-32" />
              {/* Location and time skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-1 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          {/* More options skeleton */}
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </CardHeader>

      <CardContent>
        {/* Content skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex items-center space-x-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Job post skeleton with different layout
export function JobSkeleton() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-1 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Job title skeleton */}
        <div className="mb-3">
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* Job details skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Apply button skeleton */}
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  );
}

// Poll skeleton with options
export function PollSkeleton() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-1 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Poll question skeleton */}
        <div className="mb-4">
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Poll options skeleton */}
        <div className="space-y-3 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>

        {/* Poll stats skeleton */}
        <div className="flex items-center space-x-4 text-sm">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main feed skeleton loader component
export function FeedSkeletonLoader({ count = 5 }: { count?: number }) {
  // Create a mix of different skeleton types
  const skeletonTypes = ["post", "job", "poll"];

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => {
        const type = skeletonTypes[index % skeletonTypes.length];

        switch (type) {
          case "job":
            return <JobSkeleton key={`job-skeleton-${index}`} />;
          case "poll":
            return <PollSkeleton key={`poll-skeleton-${index}`} />;
          default:
            return <PostSkeleton key={`post-skeleton-${index}`} />;
        }
      })}
    </div>
  );
}

// Skeleton component (if not already available in your UI library)
// Add this if you don't have a Skeleton component in @/components/ui/skeleton
export function SkeletonFallback({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  );
}
