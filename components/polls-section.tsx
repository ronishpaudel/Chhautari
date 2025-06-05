"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Vote, Share2, Users, Filter, Plus } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const polls = [
  {
    id: 1,
    title: "Should we organize a community cleanup drive this weekend?",
    description:
      "Vote to help us decide if we should organize a neighborhood cleanup drive this Saturday morning.",
    author: {
      name: "Community Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Thamel",
      isVerified: true,
    },
    options: [
      { text: "Yes, let's do it!", votes: 45 },
      { text: "Maybe next weekend", votes: 12 },
      { text: "Not interested", votes: 8 },
    ],
    totalVotes: 65,
    endsIn: "2 days",
    category: "COMMUNITY_EVENT",
    createdAt: "2 days ago",
    hasVoted: false,
  },
  {
    id: 2,
    title: "Which local issue should we prioritize addressing?",
    description:
      "Help us decide which local issue to focus on for the next community meeting.",
    author: {
      name: "Neighborhood Council",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Patan",
      isVerified: true,
    },
    options: [
      { text: "Road maintenance", votes: 78 },
      { text: "Waste management", votes: 92 },
      { text: "Street lighting", votes: 45 },
      { text: "Public spaces", votes: 34 },
    ],
    totalVotes: 249,
    endsIn: "5 days",
    category: "LOCAL_ISSUE",
    createdAt: "3 days ago",
    hasVoted: true,
    userVote: "Waste management",
  },
  {
    id: 3,
    title: "What time should we schedule the monthly community meeting?",
    description:
      "Vote for your preferred time for our monthly community gathering.",
    author: {
      name: "Rajesh Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Kathmandu",
      isVerified: false,
    },
    options: [
      { text: "Weekday evening (6-8 PM)", votes: 32 },
      { text: "Weekday morning (9-11 AM)", votes: 8 },
      { text: "Weekend morning (9-11 AM)", votes: 56 },
      { text: "Weekend afternoon (2-4 PM)", votes: 24 },
    ],
    totalVotes: 120,
    endsIn: "1 day",
    category: "COMMUNITY_EVENT",
    createdAt: "4 days ago",
    hasVoted: true,
    userVote: "Weekend morning (9-11 AM)",
  },
];

export function PollsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPoll, setSelectedPoll] = useState<number | null>(null);
  const [userVotes, setUserVotes] = useState<Record<number, string>>({
    2: "Waste management",
    3: "Weekend morning (9-11 AM)",
  });

  const handleVote = (pollId: number, option: string) => {
    setUserVotes((prev) => ({
      ...prev,
      [pollId]: option,
    }));
    // In a real app, you would send this vote to your API
  };

  const filteredPolls =
    activeTab === "all"
      ? polls
      : polls.filter((poll) => poll.category === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Polls</h1>
          <p className="text-muted-foreground">
            Vote on important community decisions and see what others think
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/polls/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Poll
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Polls</TabsTrigger>
            <TabsTrigger value="COMMUNITY_EVENT">Events</TabsTrigger>
            <TabsTrigger value="LOCAL_ISSUE">Local Issues</TabsTrigger>
            <TabsTrigger value="INFRASTRUCTURE">Infrastructure</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                userVote={userVotes[poll.id]}
                onVote={(option) => handleVote(poll.id, option)}
                isExpanded={selectedPoll === poll.id}
                onToggleExpand={() =>
                  setSelectedPoll(selectedPoll === poll.id ? null : poll.id)
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="COMMUNITY_EVENT" className="mt-4">
          <div className="grid gap-4">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                userVote={userVotes[poll.id]}
                onVote={(option) => handleVote(poll.id, option)}
                isExpanded={selectedPoll === poll.id}
                onToggleExpand={() =>
                  setSelectedPoll(selectedPoll === poll.id ? null : poll.id)
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="LOCAL_ISSUE" className="mt-4">
          <div className="grid gap-4">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={poll}
                userVote={userVotes[poll.id]}
                onVote={(option) => handleVote(poll.id, option)}
                isExpanded={selectedPoll === poll.id}
                onToggleExpand={() =>
                  setSelectedPoll(selectedPoll === poll.id ? null : poll.id)
                }
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="INFRASTRUCTURE" className="mt-4">
          <div className="grid gap-4">
            {filteredPolls.length > 0 ? (
              filteredPolls.map((poll) => (
                <PollCard
                  key={poll.id}
                  poll={poll}
                  userVote={userVotes[poll.id]}
                  onVote={(option) => handleVote(poll.id, option)}
                  isExpanded={selectedPoll === poll.id}
                  onToggleExpand={() =>
                    setSelectedPoll(selectedPoll === poll.id ? null : poll.id)
                  }
                />
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No infrastructure polls available at the moment.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface PollCardProps {
  poll: any;
  userVote?: string;
  onVote: (option: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function PollCard({
  poll,
  userVote,
  onVote,
  isExpanded,
  onToggleExpand,
}: PollCardProps) {
  const hasVoted = userVote !== undefined;

  const calculatePercentage = (votes: number) => {
    return Math.round((votes / poll.totalVotes) * 100);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={poll.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>{poll.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{poll.author.name}</span>
                {poll.author.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {poll.author.location}
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                {poll.createdAt}
              </div>
            </div>
          </div>
          <Badge variant="outline">Poll</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{poll.title}</h3>
          <div className="text-sm text-muted-foreground mt-1">
            <div className="flex items-center justify-between">
              <span>Ends in {poll.endsIn}</span>
              <span>
                <Users className="h-3 w-3 inline mr-1" />
                {poll.totalVotes} votes
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300">{poll.description}</p>

        <div className="space-y-3">
          {poll.options.map((option: any, index: number) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{option.text}</span>
                <span>{calculatePercentage(option.votes)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={calculatePercentage(option.votes)}
                  className={`h-2 ${
                    userVote === option.text
                      ? "bg-primary/20 [&>div]:bg-primary"
                      : "bg-muted [&>div]:bg-muted-foreground/60"
                  }`}
                />
                {!hasVoted && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onVote(option.text)}
                  >
                    Vote
                  </Button>
                )}
                {userVote === option.text && (
                  <Badge variant="secondary" className="h-5 px-1 text-xs">
                    Your vote
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Vote className="h-4 w-4 mr-1" />
              {poll.totalVotes} votes
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleExpand}>
              {isExpanded ? "Show less" : "Show details"}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            {!hasVoted && <Button size="sm">Vote Now</Button>}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Poll Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{poll.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ends</span>
                <span>in {poll.endsIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span>{poll.category.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Votes</span>
                <span>{poll.totalVotes}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
