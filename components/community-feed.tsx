"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Clock,
  Plus,
  ImageIcon,
  Video,
} from "lucide-react";
import { useState } from "react";

export function CommunityFeed() {
  const [newPost, setNewPost] = useState("");

  const feedPosts = [
    {
      id: 1,
      author: {
        name: "Rajesh Sharma",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Thamel",
        isVerified: true,
      },
      content:
        "Beautiful sunset from my rooftop today! Our neighborhood looks amazing from up here. 🌅",
      images: ["/placeholder.svg?height=300&width=400"],
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      category: "GENERAL",
    },
    {
      id: 2,
      author: {
        name: "Sita Poudel",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Patan",
        isVerified: false,
      },
      content:
        "Lost my cat near the temple. Orange tabby, very friendly. Please contact me if you see him! 🐱",
      timestamp: "4 hours ago",
      likes: 12,
      comments: 15,
      category: "LOST_FOUND",
    },
    {
      id: 3,
      author: {
        name: "Community Admin",
        avatar: "/placeholder.svg?height=40&width=40",
        location: "Lalitpur",
        isVerified: true,
      },
      content:
        "Reminder: Community cleanup drive tomorrow at 8 AM. Let's make our neighborhood beautiful together! 🧹",
      timestamp: "6 hours ago",
      likes: 45,
      comments: 12,
      category: "ANNOUNCEMENT",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle>Share with your community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What's happening in your neighborhood?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
            </div>
            <Button disabled={!newPost.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feed Filters */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="help">Help Requests</TabsTrigger>
          <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {feedPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={post.author.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {post.author.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {post.author.name}
                        </span>
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
                  <Badge variant="outline">
                    {post.category.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {post.content}
                </p>

                {post.images && (
                  <div className="grid grid-cols-1 gap-2">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt="Post content"
                        className="rounded-lg max-h-96 w-full object-cover"
                      />
                    ))}
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
