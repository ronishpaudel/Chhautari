// Enhanced FeedCard component with separate UI for different post types
"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Eye,
  Star,
  Users,
  Vote,
  Briefcase,
  DollarSign,
  Calendar,
  TrendingUp,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSnapshot } from "valtio";
import { pollStore, updatePollInStore } from "@/store/pollStore";

export interface Post {
  id: string;
  type: "post" | "job" | "poll";
  author: {
    name: string | null;
    image: string | null;
    location: string | null;
    isVerified: boolean;
  };
  content: string;
  location: string | null;
  timestamp: string;
  likes?: number;
  comments?: number;
  views?: number;
  title?: string;
  budget?: number;
  category?: string;
  isUrgent?: boolean;
  applications?: number;
  votes?: number;
  options?: string[];
  endsIn?: string;
  isHot?: boolean;
  hasVoted?: boolean;
  voteResults?: { [key: string]: number };
  userVote?: string;
  votersByOption?: Record<string, VoterInfo[]>; // New field
}

type VoterInfo = {
  id: string;
  name: string;
  image?: string;
};

// type Post = {
//   id: string;
//   type: string;
//   content: string;
//   hasVoted?: boolean;
//   userVote?: string | null;
//   votes?: number;
//   voteResults?: Record<string, number>;
//   votersByOption?: Record<string, VoterInfo[]>; // New field
//   options?: string[];
//   endsIn?: string;
//   [key: string]: any;
// };

type EnhancedPollCardProps = {
  post: Post;
  onVote: (pollId: string, option: string) => Promise<void>;
};

const EnhancedPollCard = ({ post, onVote }: EnhancedPollCardProps) => {
  const pollState = useSnapshot(pollStore);
  const currentPollState = pollState[post.id] || {
    hasVoted: post.hasVoted || false,
    selectedOption: post.userVote || null,
    voteResults: post.voteResults || {},
    votersByOption: post.votersByOption || {},
    totalVotes: post.votes || 0,
  };

  const [showResults, setShowResults] = useState(currentPollState.hasVoted);
  const [isVoting, setIsVoting] = useState(false);

  // Check if poll is expired
  const isPollExpired = post.endsIn
    ? new Date(post.endsIn) < new Date()
    : false;

  // Update show results when poll state changes
  useEffect(() => {
    setShowResults(currentPollState.hasVoted || isPollExpired);
  }, [currentPollState.hasVoted, isPollExpired]);

  // Initialize poll in store if not exists
  useEffect(() => {
    if (!pollStore[post.id]) {
      updatePollInStore(post.id, {
        hasVoted: post.hasVoted || false,
        selectedOption: post.userVote || null,
        voteResults: post.voteResults || {},
        votersByOption: post.votersByOption || {},
        totalVotes: post.votes || 0,
      });
    }
  }, [
    post.id,
    post.hasVoted,
    post.userVote,
    post.voteResults,
    post.votersByOption,
    post.votes,
  ]);

  const handleVote = async (option: string) => {
    if (currentPollState.hasVoted || isPollExpired || isVoting) return;

    setIsVoting(true);
    try {
      // Optimistic update
      const newVoteResults = {
        ...currentPollState.voteResults,
        [option]: (currentPollState.voteResults[option] || 0) + 1,
      };

      updatePollInStore(post.id, {
        hasVoted: true,
        selectedOption: option,
        voteResults: newVoteResults,
        totalVotes: currentPollState.totalVotes + 1,
      });

      setShowResults(true);

      // Make API call
      await onVote(post.id, option);
    } catch (error) {
      // Revert optimistic update on error
      updatePollInStore(post.id, {
        hasVoted: false,
        selectedOption: null,
        voteResults: currentPollState.voteResults,
        totalVotes: currentPollState.totalVotes,
      });
      setShowResults(false);
      console.error("Vote failed:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const getPercentage = (option: string) => {
    if (currentPollState.totalVotes === 0) return 0;
    return Math.round(
      ((currentPollState.voteResults[option] || 0) /
        currentPollState.totalVotes) *
        100
    );
  };

  const isWinningOption = (option: string) => {
    if (currentPollState.totalVotes === 0) return false;
    const maxVotes = Math.max(...Object.values(currentPollState.voteResults));
    return currentPollState.voteResults[option] === maxVotes && maxVotes > 0;
  };

  const canVote = !currentPollState.hasVoted && !isPollExpired && !isVoting;

  // Component to show voters for an option
  const VoterAvatars = ({ option }: { option: string }) => {
    const voters = currentPollState.votersByOption[option] || [];
    const maxVisible = 5;
    const remainingCount = voters.length - maxVisible;

    if (voters.length === 0) return null;

    return (
      <TooltipProvider>
        <div className="flex items-center gap-1 ml-2">
          <Users className="h-3 w-3 text-gray-500" />
          <div className="flex -space-x-1">
            {voters.slice(0, maxVisible).map((voter) => (
              <Tooltip key={voter.id}>
                <TooltipTrigger>
                  <Avatar className="h-5 w-5 border border-white">
                    <AvatarImage src={voter.image} />
                    <AvatarFallback className="text-xs">
                      {voter.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{voter.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            {remainingCount > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="h-5 w-5 rounded-full bg-gray-200 border border-white flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      +{remainingCount}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    {voters.slice(maxVisible).map((voter) => (
                      <div key={voter.id}>{voter.name}</div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </TooltipProvider>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 mb-4">
        <Vote className="h-5 w-5 text-purple-600" />
        <h3 className="font-semibold text-purple-800 dark:text-purple-200">
          Community Poll
        </h3>
        {post.endsIn && (
          <Badge
            variant={isPollExpired ? "destructive" : "outline"}
            className="text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            {isPollExpired
              ? "Expired"
              : `Ends ${new Date(post.endsIn).toLocaleString()}`}
          </Badge>
        )}
        {currentPollState.hasVoted && (
          <Badge
            variant="secondary"
            className="text-xs bg-green-100 text-green-700"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Voted
          </Badge>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">
        {post.content}
      </p>

      <div className="space-y-3">
        {post.options?.map((option, index) => (
          <div key={index} className="relative">
            {showResults || currentPollState.hasVoted ? (
              // Results view
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{option}</span>
                    {currentPollState.selectedOption === option && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {isWinningOption(option) && (
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    {getPercentage(option)}%
                  </span>
                </div>
                <div className="relative">
                  <Progress value={getPercentage(option)} className="h-3" />
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    <span className="text-xs text-black dark:text-white font-medium">
                      {currentPollState.voteResults[option] || 0} vote
                      {(currentPollState.voteResults[option] || 0) === 1
                        ? ""
                        : "s"}
                    </span>
                  </div>
                </div>
                <VoterAvatars option={option} />
              </div>
            ) : (
              // Voting view
              <Button
                variant="outline"
                className={`w-full justify-start p-4 h-auto transition-all ${
                  canVote
                    ? "hover:bg-purple-50 hover:border-purple-300 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canVote && handleVote(option)}
                disabled={!canVote}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      canVote ? "border-purple-400" : "border-gray-300"
                    }`}
                  />
                  <span className="font-medium">{option}</span>
                  {isVoting && (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                  )}
                </div>
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {currentPollState.totalVotes} total vote
            {currentPollState.totalVotes === 1 ? "" : "s"}
          </span>
          {/* Toggle buttons for non-voted, non-expired polls */}
          {!currentPollState.hasVoted && !isPollExpired && (
            <>
              {showResults && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowResults(false)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Hide Results
                </Button>
              )}
            </>
          )}
        </div>
        {isPollExpired && (
          <span className="text-xs text-red-500 font-medium">Poll Expired</span>
        )}
      </div>
    </div>
  );
};

export const createEnhancedVoteHandler = (
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
  toast: any
) => {
  return async (pollId: string, option: string) => {
    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Vote failed");
      }

      const updatedPoll = await res.json();

      // Update both the store and the posts state
      updatePollInStore(pollId, {
        hasVoted: true,
        selectedOption: updatedPoll.userVote,
        voteResults: updatedPoll.voteResults,
        votersByOption: updatedPoll.votersByOption,
        totalVotes: updatedPoll.totalVotes,
      });

      // Update posts state for consistency
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === pollId
            ? {
                ...post,
                hasVoted: true,
                userVote: updatedPoll.userVote,
                votes: updatedPoll.totalVotes,
                voteResults: updatedPoll.voteResults,
                votersByOption: updatedPoll.votersByOption,
              }
            : post
        )
      );

      toast({
        title: "Vote recorded!",
        description: "Your vote has been successfully submitted.",
      });
    } catch (error) {
      console.error("Vote failed:", error);
      toast({
        title: "Vote failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
};
// Enhanced Job Card Component
const EnhancedJobCard = ({ post }: { post: Post }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-6 rounded-xl border border-green-200 dark:border-green-800">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-800 dark:text-green-200">
          Job Opportunity
        </h3>
        {post.isUrgent && (
          <Badge variant="destructive" className="">
            Urgent Hiring
          </Badge>
        )}
      </div>

      <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-3">
        {post.title}
      </h4>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {post.content}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {post.budget && (
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="font-semibold text-green-700">
                NPR {post.budget.toLocaleString()}
              </p>
            </div>
          </div>
        )}
        {post.category && (
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg">
            <Star className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="font-semibold text-green-700">{post.category}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-green-600">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {post.applications} applications
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views} views
          </span>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all">
          Apply Now
        </Button>
      </div>
    </div>
  );
};

// Enhanced Post Card Component
const EnhancedPostCard = ({
  post,
  onLike,
}: {
  post: Post; // define Post type or import it
  onLike?: (postId: string) => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-800 dark:text-blue-200">
          Community Post
        </h3>
        {post.isHot && (
          <Badge className="bg-orange-100 text-orange-700 border-orange-200">
            🔥 Trending
          </Badge>
        )}
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`hover:bg-red-50 transition-colors ${
              isLiked ? "text-red-600 bg-red-50" : "hover:text-red-600"
            }`}
            onClick={handleLike}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
            />
            {likeCount}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {post.comments}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Eye className="h-4 w-4" />
          {post.views} views
        </div>
      </div>
    </div>
  );
};

export { EnhancedJobCard, EnhancedPostCard, EnhancedPollCard };
