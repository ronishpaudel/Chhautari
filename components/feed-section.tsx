"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageCircle, Share2, MapPin, Clock, Plus, Briefcase, Vote, Users } from "lucide-react"

// Mock data for demonstration
const feedPosts = [
  {
    id: 1,
    type: "post",
    author: {
      name: "Rajesh Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Thamel",
      isVerified: true,
    },
    content:
      "Looking for recommendations for a good electrician in our area. Need some wiring work done urgently. Any suggestions?",
    timestamp: "2 hours ago",
    likes: 12,
    comments: 5,
    category: "HELP_REQUEST",
  },
  {
    id: 2,
    type: "job",
    author: {
      name: "Sita Poudel",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Patan",
      isVerified: false,
    },
    title: "Need Math Tutor for Grade 10",
    content:
      "Looking for an experienced math tutor for my daughter. Preferably someone who can come home 3 times a week.",
    budget: 5000,
    timestamp: "4 hours ago",
    applications: 8,
    category: "TUTORING",
  },
  {
    id: 3,
    type: "poll",
    author: {
      name: "Community Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "Lalitpur",
      isVerified: true,
    },
    title: "Should we organize a community cleanup drive this weekend?",
    content: "Vote to help us decide if we should organize a neighborhood cleanup drive this Saturday morning.",
    timestamp: "6 hours ago",
    votes: 45,
    options: ["Yes, let's do it!", "Maybe next weekend", "Not interested"],
    endsIn: "2 days",
  },
]

export function FeedSection() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Plus className="h-5 w-5" />
              <span>Create Post</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Briefcase className="h-5 w-5" />
              <span>Post Job</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Vote className="h-5 w-5" />
              <span>Create Poll</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">5 posted today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 ending soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Community Feed</h2>
        {feedPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.author.name}</span>
                      {post.author.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {post.author.location}
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      {post.timestamp}
                    </div>
                  </div>
                </div>
                <Badge variant="outline">{post.type === "job" ? "Job" : post.type === "poll" ? "Poll" : "Post"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.type === "job" && (
                <div>
                  <h3 className="font-semibold text-lg">{(post as any).title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>Budget: NPR {(post as any).budget}</span>
                    <span>Category: {(post as any).category}</span>
                  </div>
                </div>
              )}

              {post.type === "poll" && (
                <div>
                  <h3 className="font-semibold text-lg">{(post as any).title}</h3>
                  <div className="text-sm text-muted-foreground mt-1">Ends in {(post as any).endsIn}</div>
                </div>
              )}

              <p className="text-gray-700 dark:text-gray-300">{post.content}</p>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {post.type === "post" && (
                    <>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        {(post as any).likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {(post as any).comments}
                      </Button>
                    </>
                  )}

                  {post.type === "job" && (
                    <Button variant="ghost" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      {(post as any).applications} applications
                    </Button>
                  )}

                  {post.type === "poll" && (
                    <Button variant="ghost" size="sm">
                      <Vote className="h-4 w-4 mr-1" />
                      {(post as any).votes} votes
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {post.type === "job" && <Button size="sm">Apply Now</Button>}
                  {post.type === "poll" && <Button size="sm">Vote Now</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
