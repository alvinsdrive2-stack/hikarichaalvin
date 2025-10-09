"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageSquare, Heart, Calendar, Trophy, Users, UserPlus, MapPin, Globe, Coffee } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { FlexibleAvatar } from "@/components/ui/flexible-avatar"
import { FriendList } from "@/components/social/friend-system"
import { User } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  image?: string
  points: number
  role?: string
  bio?: string
  createdAt: string
  friendCount?: number
  followerCount?: number
  followingCount?: number
  postCount?: number
  customStatus?: string
  location?: string
  website?: string
  favoriteMatcha?: string
  experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'
  userStatus?: {
    status: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
    lastSeen: string;
  }
  userProfile?: {
    bio?: string;
    location?: string;
    website?: string;
    favoriteMatcha?: string;
    experienceLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  }
  friendshipStatus?: 'NONE' | 'FRIENDS' | 'REQUEST_SENT' | 'REQUEST_RECEIVED';
}

interface Friend {
  id: string;
  friend: User;
  createdAt: string;
}

interface Achievement {
  id: string
  type: string
  title: string
  description?: string
  targetValue: number
  currentValue: number
  isCompleted: boolean
  completedAt?: string
  rewards?: string
}

export default function UserProfilePage() {
  const { userId } = useParams()
  const { data: session } = useSession()
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [friendActionLoading, setFriendActionLoading] = useState(false)

  const isOwnProfile = session?.user?.id === userId

  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const fetchUserData = async () => {
    try {
      const [achievementsResponse, friendsResponse] = await Promise.all([
        fetch(`/api/achievements/${userId}`),
        fetch(`/api/friends?type=friends&userId=${userId}`)
      ])

      if (achievementsResponse.ok) {
        const data = await achievementsResponse.json()
        setUser(data.user)
        setAchievements(data.achievements)
      } else {
        toast.error("User not found")
        router.push("/")
        return
      }

      if (friendsResponse.ok) {
        const friendsData = await friendsResponse.json()
        setFriends(friendsData.friends || [])
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'bg-green-500';
      case 'AWAY':
        return 'bg-yellow-500';
      case 'BUSY':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string, lastSeen: string) => {
    switch (status) {
      case 'ONLINE':
        return 'Online';
      case 'AWAY':
        return 'Away';
      case 'BUSY':
        return 'Busy';
      default:
        const lastSeenDate = new Date(lastSeen);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleSendFriendRequest = async () => {
    if (!session?.user?.id || !user || user.friendshipStatus !== 'NONE') return;

    setFriendActionLoading(true);
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: user.id
        }),
      });

      if (response.ok) {
        toast.success('Friend request sent!');
        setUser(prev => prev ? { ...prev, friendshipStatus: 'REQUEST_SENT' } : null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    } finally {
      setFriendActionLoading(false);
    }
  };

  const handleStartChat = (friendId: string) => {
    // TODO: Implement chat functionality
    toast.info('Chat feature coming soon!');
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'FIRST_FORUM_POST':
        return <MessageSquare className="h-4 w-4" />
      case 'FORUM_REGULAR':
        return <MessageSquare className="h-4 w-4" />
      case 'RECIPE_CREATOR':
        return <Trophy className="h-4 w-4" />
      default:
        return <Trophy className="h-4 w-4" />
    }
  }

  const getRarityColor = (isCompleted: boolean) => {
    return isCompleted
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-600 border-gray-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Link href="/" className="hidden lg:flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <FlexibleAvatar
                    src={user.image}
                    alt={user.name}
                    fallback={user.name?.charAt(0)?.toUpperCase() || 'U'}
                    size="xl"
                    className="ring-4 ring-background"
                  />
                  {user.userStatus && (
                    <div
                      className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-background ${getStatusColor(
                        user.userStatus.status
                      )}`}
                    />
                  )}
                </div>
                <div className="mt-2 text-center space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {user.role || 'Member'}
                  </Badge>
                  {user.userStatus && (
                    <div className="text-xs text-muted-foreground">
                      {getStatusText(user.userStatus.status, user.userStatus.lastSeen)}
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  {user.customStatus && (
                    <span className="text-sm text-muted-foreground">• {user.customStatus}</span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{user.email}</p>

                {/* Extended Bio */}
                {(user.bio || user.userProfile?.bio) && (
                  <p className="text-gray-700 mb-4 max-w-2xl">
                    {user.userProfile?.bio || user.bio}
                  </p>
                )}

                {/* Additional Info */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {user.points} Points
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </div>
                  )}
                  {user.userProfile?.experienceLevel && (
                    <div className="flex items-center gap-1">
                      <Coffee className="h-4 w-4" />
                      {user.userProfile.experienceLevel} Matcha Lover
                    </div>
                  )}
                </div>

                {/* Social Stats */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-600">{user.friendCount || 0}</span>
                    <span className="text-gray-500">Friends</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-500">{user.followerCount || 0}</span>
                    <span className="text-gray-500">Followers</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600">{user.followingCount || 0}</span>
                    <span className="text-gray-500">Following</span>
                  </div>
                  {user.postCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-600">{user.postCount}</span>
                      <span className="text-gray-500">Posts</span>
                    </div>
                  )}
                </div>

                {/* Favorite Matcha */}
                {user.userProfile?.favoriteMatcha && (
                  <div className="mt-3 flex items-center justify-center lg:justify-start gap-2 text-sm">
                    <Coffee className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">
                      Favorite: <span className="font-medium text-green-600">{user.userProfile.favoriteMatcha}</span>
                    </span>
                  </div>
                )}

                {/* Website */}
                {user.userProfile?.website && (
                  <div className="mt-2 flex items-center justify-center lg:justify-start gap-2 text-sm">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <a
                      href={user.userProfile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {user.userProfile.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {isOwnProfile ? (
                  <Button onClick={() => router.push("/profile")}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleStartChat(user.id)}
                    >
                      Message
                    </Button>
                    {user.friendshipStatus === 'NONE' && (
                      <Button
                        onClick={handleSendFriendRequest}
                        disabled={friendActionLoading}
                        className="w-full"
                      >
                        {friendActionLoading ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Friend
                          </>
                        )}
                      </Button>
                    )}
                    {user.friendshipStatus === 'FRIENDS' && (
                      <Badge variant="default" className="w-full justify-center py-2">
                        <Users className="h-4 w-4 mr-2" />
                        Friends
                      </Badge>
                    )}
                    {user.friendshipStatus === 'REQUEST_SENT' && (
                      <Badge variant="secondary" className="w-full justify-center py-2">
                        Request Sent
                      </Badge>
                    )}
                    {user.friendshipStatus === 'REQUEST_RECEIVED' && (
                      <Button
                        variant="secondary"
                        onClick={() => router.push('/friends?tab=requests')}
                        className="w-full"
                      >
                        View Request
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Achievements */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="friends">
              Friends
              {friends.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {friends.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="achievements">
              Achievements
              {achievements.filter(a => a.isCompleted).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {achievements.filter(a => a.isCompleted).length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.points}
                    </div>
                    <p className="text-sm text-gray-600">Points</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {achievements.filter(a => a.isCompleted).length}
                    </div>
                    <p className="text-sm text-gray-600">Achievements</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <p className="text-sm text-gray-600">Days Active</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            {achievements.filter(a => a.isCompleted).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements
                      .filter(a => a.isCompleted)
                      .slice(0, 5)
                      .map((achievement) => (
                        <div
                          key={achievement.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${getRarityColor(achievement.isCompleted)}`}
                        >
                          <div className="flex-shrink-0">
                            {getAchievementIcon(achievement.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">
                              {achievement.title}
                            </h4>
                            {achievement.description && (
                              <p className="text-xs opacity-75 mt-1">
                                {achievement.description}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <Trophy className="h-4 w-4" />
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="friends" className="space-y-4">
            <FriendList
              friends={friends}
              onStartChat={handleStartChat}
              className="w-full"
            />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 p-2 rounded-full ${getRarityColor(achievement.isCompleted)}`}>
                        {getAchievementIcon(achievement.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.title}</h3>
                        {achievement.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.description}
                          </p>
                        )}
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {achievement.currentValue}/{achievement.targetValue}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(achievement.currentValue / achievement.targetValue) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                        {achievement.isCompleted && achievement.completedAt && (
                          <p className="text-xs text-green-600 mt-2">
                            Completed on {formatDate(achievement.completedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}