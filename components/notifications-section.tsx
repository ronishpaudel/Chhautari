"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Check,
  Briefcase,
  MessageCircle,
  Vote,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Mock data for demonstration
const notifications = [
  {
    id: 1,
    type: "JOB_APPLICATION",
    title: "New Job Application",
    message: "Rajesh Sharma has applied for your plumbing job",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    user: {
      name: "Rajesh Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    data: {
      jobId: 123,
      jobTitle: "Fix Leaky Faucet",
    },
  },
  {
    id: 2,
    type: "CHAT_MESSAGE",
    title: "New Message",
    message: "Sita Poudel sent you a message",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    user: {
      name: "Sita Poudel",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    data: {
      chatId: 456,
      preview: "I'll be available tomorrow for the plumbing work.",
    },
  },
  {
    id: 3,
    type: "POLL_CREATED",
    title: "New Community Poll",
    message: "A new poll has been created in your neighborhood",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
    user: {
      name: "Community Admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    data: {
      pollId: 789,
      pollTitle: "Should we organize a community cleanup drive this weekend?",
    },
  },
  {
    id: 4,
    type: "JOB_COMPLETED",
    title: "Job Completed",
    message: "Your tutoring job has been marked as completed",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    user: {
      name: "Gita KC",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    data: {
      jobId: 101,
      jobTitle: "Math Tutoring for Grade 10",
    },
  },
  {
    id: 5,
    type: "COMMENT",
    title: "New Comment",
    message: "Binod Gurung commented on your post",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    isRead: true,
    user: {
      name: "Binod Gurung",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    data: {
      postId: 202,
      comment: "Thanks for sharing this information!",
    },
  },
  {
    id: 6,
    type: "SYSTEM",
    title: "Account Verified",
    message: "Your account has been verified",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    isRead: true,
    data: {
      type: "verification",
    },
  },
  {
    id: 7,
    type: "POLL_ENDED",
    title: "Poll Ended",
    message: "A poll you participated in has ended",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    isRead: true,
    user: {
      name: "Community Admin",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    data: {
      pollId: 303,
      pollTitle: "What time should we schedule the monthly community meeting?",
      result: "Weekend morning (9-11 AM)",
    },
  },
];

export function NotificationsSection() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationState, setNotificationState] = useState(notifications);

  const unreadCount = notificationState.filter(
    (notification) => !notification.isRead
  ).length;

  const markAsRead = (id: number) => {
    setNotificationState((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationState((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "JOB_APPLICATION":
      case "JOB_ACCEPTED":
      case "JOB_COMPLETED":
        return <Briefcase className="h-5 w-5" />;
      case "CHAT_MESSAGE":
        return <MessageCircle className="h-5 w-5" />;
      case "POLL_CREATED":
      case "POLL_ENDED":
        return <Vote className="h-5 w-5" />;
      case "COMMENT":
        return <Users className="h-5 w-5" />;
      case "NEW_POST":
        return <Users className="h-5 w-5" />;
      case "SYSTEM":
        return <Bell className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "JOB_APPLICATION":
      case "JOB_ACCEPTED":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
      case "JOB_COMPLETED":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
      case "CHAT_MESSAGE":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300";
      case "POLL_CREATED":
      case "POLL_ENDED":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300";
      case "COMMENT":
      case "NEW_POST":
        return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300";
      case "SYSTEM":
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const filteredNotifications = notificationState.filter((notification) => {
    if (activeTab === "unread") return !notification.isRead;
    if (activeTab === "jobs") return notification.type.includes("JOB");
    if (activeTab === "polls") return notification.type.includes("POLL");
    if (activeTab === "messages")
      return (
        notification.type === "CHAT_MESSAGE" || notification.type === "COMMENT"
      );
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your community activity
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">
              All
              {notificationState.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notificationState.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="polls">Polls</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>
                  {activeTab === "all"
                    ? "All Notifications"
                    : activeTab === "unread"
                    ? "Unread Notifications"
                    : `${
                        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                      } Notifications`}
                </span>
                {filteredNotifications.length > 0 && (
                  <Badge variant="outline">
                    {filteredNotifications.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-1">
                    {filteredNotifications.map((notification, index) => (
                      <div key={notification.id}>
                        <div
                          className={`flex items-start gap-4 p-4 rounded-lg ${
                            !notification.isRead ? "bg-muted/50" : ""
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getNotificationColor(
                              notification.type
                            )}`}
                          >
                            {getNotificationIcon(notification.type)}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notification.timestamp, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {notification.user && (
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      notification.user.avatar ||
                                      "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback>
                                    {notification.user.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <p className="text-sm">{notification.message}</p>
                            </div>

                            {notification.data &&
                              notification.type === "JOB_APPLICATION" && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">Job: </span>
                                  {notification.data.jobTitle}
                                </div>
                              )}

                            {notification.data &&
                              notification.type === "POLL_CREATED" && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">Poll: </span>
                                  {notification.data.pollTitle}
                                </div>
                              )}

                            {notification.data &&
                              notification.type === "POLL_ENDED" && (
                                <div className="mt-2 text-sm">
                                  <span className="font-medium">Result: </span>
                                  {notification.data.result}
                                </div>
                              )}

                            {notification.data &&
                              notification.type === "CHAT_MESSAGE" && (
                                <div className="mt-2 text-sm italic text-muted-foreground">
                                  "{notification.data.preview}"
                                </div>
                              )}

                            <div className="flex items-center gap-2 mt-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Mark as read
                                </Button>
                              )}

                              {notification.type === "JOB_APPLICATION" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                  >
                                    View Application
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                  >
                                    Message
                                  </Button>
                                </>
                              )}

                              {notification.type === "CHAT_MESSAGE" && (
                                <Button size="sm" className="h-7 px-2 text-xs">
                                  Reply
                                </Button>
                              )}

                              {notification.type === "POLL_CREATED" && (
                                <Button size="sm" className="h-7 px-2 text-xs">
                                  Vote Now
                                </Button>
                              )}

                              {notification.type === "POLL_ENDED" && (
                                <Button size="sm" className="h-7 px-2 text-xs">
                                  View Results
                                </Button>
                              )}

                              {notification.type === "COMMENT" && (
                                <Button size="sm" className="h-7 px-2 text-xs">
                                  View Comment
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < filteredNotifications.length - 1 && (
                          <Separator />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Bell className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-muted-foreground text-center mt-1">
                      {activeTab === "unread"
                        ? "You've read all your notifications."
                        : `You don't have any ${
                            activeTab !== "all" ? activeTab : ""
                          } notifications at the moment.`}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
