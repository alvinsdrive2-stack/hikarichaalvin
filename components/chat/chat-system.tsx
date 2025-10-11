"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { OnlineStatus } from "./online-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Plus,
  Search,
  X,
  UserPlus,
  Video,
  Phone
} from "lucide-react";
import { FlexibleAvatar } from "@/components/ui/flexible-avatar";
import { useUserBorder } from "@/hooks/useUserBorder";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  name?: string;
  participantIds: string[];
  participants: Array<{
    id: string;
    name: string;
    image?: string;
    status?: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  }>;
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  };
  unreadCount: number;
  isPinned: boolean;
}

interface User {
  id: string;
  name: string;
  image?: string;
  status?: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  friendStatus?: 'NONE' | 'FRIENDS' | 'REQUEST_SENT' | 'REQUEST_RECEIVED';
}

export function ChatSystem() {
  const { data: session } = useSession();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedConversation = null; // This would be fetched from conversations

  useEffect(() => {
    if (searchQuery) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users.filter((u: User) => u.id !== session?.user?.id) || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleStartNewChat = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'DIRECT',
          participantIds: [userId]
        })
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversationId(conversation.id);
        setShowNewChatDialog(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      alert('Please enter a group name and select at least 2 members');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'GROUP',
          name: groupName.trim(),
          participantIds: selectedUsers.map(u => u.id)
        })
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversationId(conversation.id);
        setShowCreateGroupDialog(false);
        setGroupName("");
        setSelectedUsers([]);
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: User) => {
    const isSelected = selectedUsers.some(u => u.id === user.id);
    if (isSelected) {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ receiverId: userId })
      });

      if (response.ok) {
        // Update search results to reflect new friend status
        setSearchResults(prev => prev.map(u =>
          u.id === userId ? { ...u, friendStatus: 'REQUEST_SENT' } : u
        ));
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  if (!session?.user?.id) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">Sign in to Chat</h3>
          <p className="text-gray-600">You need to be signed in to use the chat system.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex">
      {/* Chat Sidebar */}
      <div className="w-80 border-r">
        <ChatSidebar
          selectedConversationId={selectedConversationId || undefined}
          onConversationSelect={setSelectedConversationId}
          onStartNewChat={() => setShowNewChatDialog(true)}
          onCreateGroup={() => setShowCreateGroupDialog(true)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        {selectedConversationId ? (
          <ChatWindow
            conversation={selectedConversation!}
            onConversationInfo={() => {}}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to Chat
              </h3>
              <p className="text-gray-600 mb-6">
                Select a conversation to start messaging, or create a new one
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setShowNewChatDialog(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Start New Chat
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateGroupDialog(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Online Status Sidebar (Desktop) */}
        <div className="hidden lg:block w-64">
          <OnlineStatus
            compact={true}
            maxVisible={8}
            onStartChat={handleStartNewChat}
            onAddFriend={handleAddFriend}
          />
        </div>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Start New Chat
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {searchResults.map((user) => {
                const { border: userBorder } = useUserBorder(user.id);
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleStartNewChat(user.id)}
                  >
                    <FlexibleAvatar
                      src={user.image}
                      name={user.name}
                      userBorder={userBorder}
                      size="md"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        {user.status === 'ONLINE' ? 'Online' : user.status || 'Offline'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.friendStatus === 'FRIENDS' && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          Friends
                        </Badge>
                      )}
                      {user.friendStatus === 'REQUEST_SENT' && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                          Request Sent
                        </Badge>
                      )}
                      {user.friendStatus === 'REQUEST_RECEIVED' && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Request Received
                        </Badge>
                      )}
                      {user.friendStatus === 'NONE' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddFriend(user.id);
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}

              {searchQuery && searchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No users found</p>
                </div>
              )}

              {!searchQuery && (
                <div className="text-center py-8 text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Type to search for users</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Group Dialog */}
      <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Create Group Chat
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Group Name */}
            <div>
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            {/* Search Users */}
            <div>
              <Label>Add Members ({selectedUsers.length} selected)</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleSelectUser(user)}
                  >
                    {user.name}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Search Results */}
            <div className="max-h-40 overflow-y-auto space-y-2">
              {searchResults.map((user) => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                const { border: userBorder } = useUserBorder(user.id);

                return (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer",
                      isSelected ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                    )}
                    onClick={() => handleSelectUser(user)}
                  >
                    <FlexibleAvatar
                      src={user.image}
                      name={user.name}
                      userBorder={userBorder}
                      size="sm"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{user.name}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateGroupDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={loading || !groupName.trim() || selectedUsers.length < 2}
                className="flex-1"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  'Create Group'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}