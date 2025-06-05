"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  ImageIcon,
  Paperclip,
  Smile,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";

// Mock data for demonstration
const contacts = [
  {
    id: 1,
    name: "Rajesh Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Do you have time to discuss the community garden project?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 2,
    online: true,
    isVerified: true,
  },
  {
    id: 2,
    name: "Sita Poudel",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'll be available tomorrow for the plumbing work.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: 0,
    online: false,
    isVerified: true,
  },
  {
    id: 3,
    name: "Hari Thapa",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Thanks for your help with the electrical issue!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 0,
    online: true,
    isVerified: false,
  },
  {
    id: 4,
    name: "Gita KC",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When can you start the tutoring sessions?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unread: 1,
    online: false,
    isVerified: true,
  },
  {
    id: 5,
    name: "Binod Gurung",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've sent you the details for the community meeting.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 0,
    online: false,
    isVerified: false,
  },
];

// Mock conversation data
const conversations: Record<
  number,
  Array<{ id: number; sender: number; text: string; timestamp: Date }>
> = {
  1: [
    {
      id: 1,
      sender: 1,
      text: "Hello! I wanted to discuss the community garden project with you.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: 2,
      sender: 999, // current user
      text: "Hi Rajesh! Sure, I'd be happy to discuss it. What do you have in mind?",
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
    },
    {
      id: 3,
      sender: 1,
      text: "I was thinking we could use the empty lot near the community center. It has good sunlight and water access.",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      id: 4,
      sender: 999,
      text: "That's a great idea! How many people have shown interest so far?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: 5,
      sender: 1,
      text: "About 10 families are interested. We could start with basic vegetables and herbs.",
      timestamp: new Date(Date.now() - 1000 * 60 * 40),
    },
    {
      id: 6,
      sender: 1,
      text: "Do you have time to meet this weekend to visit the site together?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  2: [
    {
      id: 1,
      sender: 2,
      text: "Hello, I saw your job posting for plumbing work.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 2,
      sender: 999,
      text: "Hi Sita! Yes, I need help with fixing a leaky faucet and a clogged drain.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
    },
    {
      id: 3,
      sender: 2,
      text: "I can help with that. My rate is Rs. 500 per hour plus materials.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8),
    },
    {
      id: 4,
      sender: 999,
      text: "That sounds reasonable. When are you available?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7),
    },
    {
      id: 5,
      sender: 2,
      text: "I'll be available tomorrow for the plumbing work.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
};

export function MessagesSection() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContact, setSelectedContact] = useState<number | null>(1); // Default to first contact
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom of messages when conversation changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedContact]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    // In a real app, you would send this message to your API
    console.log(`Sending message to contact ${selectedContact}: ${message}`);

    // For demo purposes, we'll just add it to our mock data
    if (conversations[selectedContact]) {
      conversations[selectedContact].push({
        id: Math.max(...conversations[selectedContact].map((m) => m.id)) + 1,
        sender: 999, // current user
        text: message,
        timestamp: new Date(),
      });
    } else {
      conversations[selectedContact] = [
        {
          id: 1,
          sender: 999,
          text: message,
          timestamp: new Date(),
        },
      ];
    }

    setMessage("");

    // Scroll to bottom after sending
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const selectedContactData = contacts.find(
    (contact) => contact.id === selectedContact
  );
  const conversation = selectedContact
    ? conversations[selectedContact] || []
    : [];

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="flex h-full">
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="px-4 pt-4"
          >
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
              </TabsTrigger>
              <TabsTrigger value="online" className="flex-1">
                Online
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {filteredContacts
                .filter((contact) => {
                  if (activeTab === "unread") return contact.unread > 0;
                  if (activeTab === "online") return contact.online;
                  return true;
                })
                .map((contact) => (
                  <div
                    key={contact.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                      selectedContact === contact.id
                        ? "bg-primary/10"
                        : "hover:bg-muted transition-colors"
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={contact.avatar || "/placeholder.svg"}
                        />
                        <AvatarFallback>
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="font-medium truncate">
                            {contact.name}
                          </span>
                          {contact.isVerified && (
                            <Badge
                              variant="secondary"
                              className="h-5 px-1 text-xs"
                            >
                              Verified
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(contact.timestamp, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.lastMessage}
                      </p>
                    </div>
                    {contact.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                ))}

              {filteredContacts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No contacts found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        {selectedContact ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedContactData?.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {selectedContactData?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{selectedContactData?.name}</h3>
                    {selectedContactData?.isVerified && (
                      <Badge variant="secondary" className="h-5 px-1 text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedContactData?.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {conversation.map((msg) => {
                  const isCurrentUser = msg.sender === 999;
                  const contact = contacts.find((c) => c.id === msg.sender);

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div className="flex gap-2 max-w-[80%]">
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={contact?.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {contact?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <div
                            className={`rounded-lg p-3 ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(msg.timestamp, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
