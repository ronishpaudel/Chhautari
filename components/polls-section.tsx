"use client";

import { useEffect, useState } from "react";
import {
  createEnhancedVoteHandler,
  EnhancedPollCard,
  Post,
} from "./feed-cards"; // Adjust import path
import { useToast } from "@/hooks/use-toast";
import { createPoll, fetchPoll } from "@/lib/feed-api";
import { CreatePollDialog } from "./create-poll.dialog";
import { useSession } from "next-auth/react";
import { JobCardSkeleton } from "./job-section";

export function PollsSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    async function loadPolls() {
      setLoading(true);
      try {
        const data = await fetchPoll();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch polls", error);
        toast({
          title: "Error",
          description: "Failed to load polls",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    loadPolls();
  }, [toast]);

  const onVote = createEnhancedVoteHandler(setPosts, toast);

  if (loading)
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, idx) => (
          <JobCardSkeleton key={idx} />
        ))}
      </div>
    );
  const handleCreatePoll = async (
    question: string,
    options: string[],
    expiresAt?: string
  ) => {
    await createPoll({
      question,
      options,
      expiresAt,
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div className="flex flex-col ">
          <h1 className="text-3xl font-bold">Poll and Voting</h1>
          <p className="text-muted-foreground">
            Stay updated with your {session?.user.location} neighborhood
          </p>
        </div>
        <CreatePollDialog onCreate={handleCreatePoll} />
      </div>

      {posts.length === 0 && <p>No polls available.</p>}
      {posts.map((post) => (
        <EnhancedPollCard key={post.id} post={post} onVote={onVote} />
      ))}
    </div>
  );
}
