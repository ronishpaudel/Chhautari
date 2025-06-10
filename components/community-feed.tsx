"use client";

import { useEffect, useState } from "react";
import { createPost, fetchPost } from "@/lib/feed-api"; // adjust path
import { EnhancedPostCard, Post } from "./feed-cards";
import { Badge } from "@/components/ui/badge";
import { CreatePostDialog } from "./create-post.dialog";
import { useSession } from "next-auth/react";

const EnhancedPostCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-blue-300 dark:bg-blue-700" />
        <div className="h-6 w-32 rounded bg-blue-300 dark:bg-blue-700" />
        <Badge className="invisible">Placeholder</Badge> {/* Keeps layout */}
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <div className="h-4 rounded bg-gray-300 dark:bg-gray-700 w-full" />
        <div className="h-4 rounded bg-gray-300 dark:bg-gray-700 w-5/6" />
        <div className="h-4 rounded bg-gray-300 dark:bg-gray-700 w-3/4" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-6 w-16 rounded bg-gray-300 dark:bg-gray-700" />
          <div className="h-6 w-20 rounded bg-gray-300 dark:bg-gray-700" />
        </div>
        <div className="h-5 w-20 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();

  // Load posts
  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPost();
      setPosts(data);
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Handler for creating a new post
  const handleCreatePost = async (content: string, location?: string) => {
    await createPost({ content, location });
    await loadPosts(); // Refresh feed after successful post
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <h1 className="text-3xl font-bold">Community Feed</h1>
          <p className="text-muted-foreground">
            Stay updated with your {session.data?.user.location} neighborhood
          </p>
        </div>
        <CreatePostDialog onCreate={handleCreatePost} />
      </div>

      {/* Loading Skeleton */}
      {loading && <EnhancedPostCardSkeleton />}

      {/* Posts List */}
      {!loading && posts.length === 0 && <p>No posts found.</p>}
      {!loading &&
        posts.map((post) => <EnhancedPostCard key={post.id} post={post} />)}
    </div>
  );
}
