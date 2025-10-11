"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  Video,
  MoreVertical,
  Search,
  Info,
  Pin,
  Users,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageBubble, TypingIndicator } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { FlexibleAvatar } from "@/components/ui/flexible-avatar";
import { useUserBorder } from "@/hooks/useUserBorder";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  replyToId?: string;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  isEdited: boolean;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  createdAt: string;
  updatedAt?: string;
  readBy: string[];
}

interface Participant {
  id: string;
  name: string;
  image?: string;
  status?: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  lastSeen?: string;
  role?: 'ADMIN' | 'MEMBER';
}

interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  name?: string;
  description?: string;
  participantIds: string[];
  participants: Participant[];
  isPinned: boolean;
  isMuted: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  conversation: Conversation;
  onBack?: () => void;
  onConversationInfo?: () => void;
}

export function ChatWindow({
  conversation,
  onBack,
  onConversationInfo
}: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Participant[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const isOwnMessage = (senderId: string) => senderId === session?.user?.id;
  const isGroup = conversation.type === 'GROUP';

  useEffect(() => {
    if (conversation.id) {
      fetchMessages();
      markAsRead();
    }
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Set up WebSocket connection for real-time updates
    const handleNewMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      if (message.conversationId === conversation.id) {
        setMessages(prev => [...prev, message]);
        if (message.senderId !== session?.user?.id) {
          markAsRead();
        }
      }
    };

    const handleTypingIndicator = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.conversationId === conversation.id && data.isTyping) {
        setTypingUsers(prev => {
          const existing = prev.find(u => u.id === data.userId);
          if (!existing) {
            const user = conversation.participants.find(p => p.id === data.userId);
            if (user) {
              return [...prev, user];
            }
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(u => u.id !== data.userId));
      }
    };

    // In a real implementation, you'd set up WebSocket listeners here
    // For now, we'll simulate with polling
    const interval = setInterval(() => {
      // Simulate real-time updates
    }, 5000);

    return () => clearInterval(interval);
  }, [conversation.id, session?.user?.id]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversation.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`/api/chat/conversations/${conversation.id}/read`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const scrollToBottom = () => {
    if (!isScrolling) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setIsScrolling(!isAtBottom);
    }
  };

  const handleSendMessage = async (content: string, type: 'TEXT' | 'IMAGE' | 'FILE', file?: File) => {
    try {
      let messageData: any = {
        conversationId: conversation.id,
        content,
        type,
        replyToId: replyingTo?.id
      };

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', conversation.id);
        formData.append('content', content);
        formData.append('type', type);
        if (replyingTo?.id) {
          formData.append('replyToId', replyingTo.id);
        }

        const response = await fetch('/api/chat/messages/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const message = await response.json();
          setMessages(prev => [...prev, message]);
        }
      } else {
        const response = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(messageData)
        });

        if (response.ok) {
          const message = await response.json();
          setMessages(prev => [...prev, message]);
        }
      }

      setReplyingTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTypingStart = () => {
    // Send typing indicator via WebSocket
  };

  const handleTypingStop = () => {
    // Stop typing indicator via WebSocket
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleEdit = (messageId: string) => {
    // Implement message editing
  };

  const handleDelete = async (messageId: string) => {
    try {
      await fetch(`/api/chat/messages/${messageId}`, {
        method: 'DELETE'
      });
      setMessages(prev => prev.filter(m => m.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const response = await fetch(`/api/chat/messages/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ emoji })
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        setMessages(prev => prev.map(m => m.id === messageId ? updatedMessage : m));
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const getConversationName = () => {
    if (conversation.type === 'GROUP') {
      return conversation.name;
    }
    const otherParticipant = conversation.participants.find(p => p.id !== session?.user?.id);
    return otherParticipant?.name || 'Unknown';
  };

  const getConversationAvatar = () => {
    if (conversation.type === 'GROUP') {
      return {
        src: undefined,
        name: conversation.name || 'Group'
      };
    }
    const otherParticipant = conversation.participants.find(p => p.id !== session?.user?.id);
    return {
      src: otherParticipant?.image,
      name: otherParticipant?.name || 'Unknown'
    };
  };

  const getStatusText = () => {
    if (conversation.type === 'GROUP') {
      return `${conversation.participants.length} members`;
    }
    const otherParticipant = conversation.participants.find(p => p.id !== session?.user?.id);
    if (!otherParticipant) return '';

    switch (otherParticipant.status) {
      case 'ONLINE': return 'Online';
      case 'AWAY': return 'Away';
      case 'BUSY': return 'Busy';
      default:
        if (!otherParticipant.lastSeen) return 'Offline';
        const lastSeenDate = new Date(otherParticipant.lastSeen);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const avatarData = getConversationAvatar();
  const { border: userBorder } = useUserBorder(
    conversation.type === 'DIRECT' ? conversation.participants.find(p => p.id !== session?.user?.id)?.id : session?.user?.id
  );

  return (
    <Card className="h-full flex flex-col">
      {/* Chat Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back button for mobile */}
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="md:hidden"
              >
                ←
              </Button>
            )}

            {/* Avatar */}
            <div className="relative">
              {conversation.type === 'DIRECT' ? (
                <FlexibleAvatar
                  src={avatarData.src}
                  name={avatarData.name}
                  userBorder={userBorder}
                  size="md"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Conversation info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg truncate">
                  {getConversationName()}
                </CardTitle>
                {conversation.isPinned && (
                  <Pin className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">
                {getStatusText()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {conversation.type === 'DIRECT' && (
              <>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Video className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onConversationInfo}>
                  <Info className="h-4 w-4 mr-2" />
                  {conversation.type === 'GROUP' ? 'Group Info' : 'Contact Info'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {conversation.isPinned ? (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Unpin Chat
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin Chat
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {conversation.isMuted ? (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Unmute Notifications
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Mute Notifications
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0">
        <ScrollArea
          ref={scrollAreaRef}
          className="h-full"
          onScroll={handleScroll}
        >
          <div className="p-4 space-y-1">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const sender = conversation.participants.find(p => p.id === message.senderId);
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      sender={sender}
                      isOwn={isOwnMessage(message.senderId)}
                      isGroup={isGroup}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onReaction={handleReaction}
                    />
                  );
                })}

                {/* Typing indicator */}
                {typingUsers.length > 0 && (
                  <TypingIndicator users={typingUsers} />
                )}

                {/* Scroll to bottom ref */}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Chat Input */}
      <div className="p-4 border-t">
        <ChatInput
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          replyTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          disabled={loading}
        />
      </div>
    </Card>
  );
}