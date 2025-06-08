// Enhanced FeedSection component with separate UI for different post types
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  Eye,
  Star,
  Users,
  Vote,
  Sparkles,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import {
  fetchFeedItems,
  createPost,
  createJob,
  createPoll,
  likePost,
} from "@/lib/feed-api";

import { CreatePostDialog } from "./create-post.dialog";
import { CreateJobDialog } from "./create-job.dialog";
import { CreatePollDialog } from "./create-poll.dialog";
import {
  createEnhancedVoteHandler,
  EnhancedJobCard,
  EnhancedPollCard,
  EnhancedPostCard,
  Post,
} from "./feed-cards";

export function FeedSection() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const handleVote = createEnhancedVoteHandler(setPosts, toast);

  useEffect(() => {
    async function loadFeed() {
      try {
        const feedItems = await fetchFeedItems();
        const mappedPosts: Post[] = feedItems.map((item: any) => ({
          id: item.id,
          type: item.type,
          author: {
            name: item.user?.name || session?.user?.name || "Anonymous",
            image: item.user?.image || session?.user?.image || null,
            location: item.user?.location || session?.user?.location || null,
            isVerified: item.user?.isVerified || false,
          },
          content: item.content || item.description || item.question,
          location: item.location || null,
          timestamp: new Date(item.createdAt).toLocaleString(),
          likes: item.type === "post" ? item.likes || 0 : undefined,
          comments:
            item.type === "post" ? item.comments?.length || 0 : undefined,
          views: item.views || 0,
          title: item.title,
          budget: item.budget,
          category: item.category,
          isUrgent: item.isUrgent,
          applications:
            item.type === "job" ? item.applications?.length || 0 : undefined,
          votes: item.type === "poll" ? item.votes?.length || 0 : undefined,
          options: item.options,
          endsIn: item.expiresAt
            ? new Date(item.expiresAt).toLocaleString()
            : undefined,
          isHot: item.isHot,
          hasVoted: item.hasVoted || false,
          voteResults: item.voteResults || {},
          userVote: item.userVote || null,
        }));
        setPosts(mappedPosts);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load community feed.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, [session, toast]);

  // Handlers for creating content (same as before)
  const handleCreatePost = async (content: string, location?: string) => {
    try {
      const newPost = await createPost({ content, location });
      setPosts((prev) => [
        {
          id: newPost.id,
          type: "post",
          author: {
            name: session?.user?.name || "Anonymous",
            image: session?.user?.image || null,
            location: session?.user?.location || null,
            isVerified: session?.user?.isVerified || false,
          },
          content: newPost.content,
          location: newPost.location,
          timestamp: new Date(newPost.createdAt).toLocaleString(),
          likes: 0,
          comments: 0,
          views: 0,
        },
        ...prev,
      ]);
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      throw new Error("Failed to create post");
    }
  };

  const handleCreateJob = async (
    title: string,
    description: string,
    category?: string,
    location?: string
  ) => {
    try {
      const newJob = await createJob({
        title,
        description,
        category,
        location,
      });
      setPosts((prev) => [
        {
          id: newJob.id,
          type: "job",
          author: {
            name: session?.user?.name || "Anonymous",
            image: session?.user?.image || null,
            location: session?.user?.location || null,
            isVerified: session?.user?.isVerified || false,
          },
          content: newJob.description,
          location: newJob.location,
          timestamp: new Date(newJob.createdAt).toLocaleString(),
          title: newJob.title,
          category: newJob.category,
        },
        ...prev,
      ]);
      toast({
        title: "Job created!",
        description: "Your job has been posted to the community.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create job. Please try again.",
        variant: "destructive",
      });
      throw new Error("Failed to create job");
    }
  };

  const handleCreatePoll = async (
    question: string,
    options: string[],
    expiresAt?: string
  ) => {
    try {
      const newPoll = await createPoll({ question, options, expiresAt });
      setPosts((prev) => [
        {
          id: newPoll.id,
          type: "poll",
          author: {
            name: session?.user?.name || "Anonymous",
            image: session?.user?.image || null,
            location: session?.user?.location || null,
            isVerified: session?.user?.isVerified || false,
          },
          content: newPoll.question,
          timestamp: new Date(newPoll.createdAt).toLocaleString(),
          options: newPoll.options,
          votes: 0,
          views: 0,
          endsIn: newPoll.expiresAt
            ? new Date(newPoll.expiresAt).toLocaleString()
            : undefined,
          location: session?.user?.location || null,
          hasVoted: false,
          voteResults: {},
        },
        ...prev,
      ]);
      toast({
        title: "Poll created!",
        description: "Your poll has been shared with the community.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create poll. Please try again.",
        variant: "destructive",
      });
      throw new Error("Failed to create poll");
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch {
      toast({
        title: "Error",
        description: "Failed to like post.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                What's happening in your community?
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Share, connect, and grow together
              </p>
            </div>
            <Sparkles className="h-6 w-6 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CreatePostDialog onCreate={handleCreatePost} />
            <CreateJobDialog onCreate={handleCreateJob} />
            <CreatePollDialog onCreate={handleCreatePoll} />
          </div>
        </CardContent>
      </Card>

      {/* Community Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Community Feed</h2>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {posts.map((post) => (
          <Card
            key={post.id}
            className="hover:shadow-lg transition-all duration-300 border-0 shadow-md"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="ring-2 ring-transparent hover:ring-blue-200 transition-all">
                    <AvatarImage
                      src={post.author.image || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback>
                      {post.author.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold hover:text-blue-600 cursor-pointer transition-colors">
                        {post.author.name}
                      </span>
                      {post.author.isVerified && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-700"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.author.location || "Unknown"}
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      {post.timestamp}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {post.type === "post" && (
                <EnhancedPostCard post={post} onLike={handleLike} />
              )}
              {post.type === "job" && <EnhancedJobCard post={post} />}
              {post.type === "poll" && (
                <EnhancedPollCard post={post} onVote={handleVote} />
              )}

              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-6">
        <Button
          variant="outline"
          className="hover:shadow-lg transition-all duration-300"
        >
          Load More Posts
          <Loader2 className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
