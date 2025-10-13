"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, UserPlus, Search, RefreshCw, UserCheck } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { FriendList, FindFriends, FriendSuggestions, FriendRequestCard } from "@/components/social/friend-system"
import { FollowButton } from "@/components/social/follow-button"
import { BorderDisplay } from "@/components/ui/border-display"

interface User {
  id: string
  name: string
  email: string
  image?: string
  customStatus?: string
  friendCount: number
  userstatus?: {
    status: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
    lastSeen: string;
  };
  friendshipStatus: 'NONE' | 'FRIENDS' | 'REQUEST_SENT' | 'REQUEST_RECEIVED';
}

interface Friend {
  id: string;
  friend: User;
  createdAt: string;
}

interface FriendRequest {
  id: string;
  sender?: User;
  receiver?: User;
  createdAt: string;
}

interface FollowingUser {
  id: string
  name: string
  avatar?: string
  border?: string
  bio?: string
  followerCount: number
  followingCount: number
  postCount: number
  followedAt: string
  isFollowing?: boolean
  isFollowingBack?: boolean
}

export default function FriendsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  // Friends data
  const [friends, setFriends] = useState<Friend[]>([])
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([])

  // Following data
  const [following, setFollowing] = useState<FollowingUser[]>([])
  const [followers, setFollowers] = useState<FollowingUser[]>([])

  // User stats
  const [userStats, setUserStats] = useState({
    friendCount: 0,
    followerCount: 0,
    followingCount: 0,
    postCount: 0
  })

  // Loading states
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    // Don't do anything while session is loading
    if (status === 'loading') return

    // If session is loaded and user is not authenticated, redirect
    if (status === 'unauthenticated') {
      router.push('/auth/login')
      return
    }

    // If user is authenticated, fetch friends data
    if (status === 'authenticated' && session) {
      fetchFriendsData()
    }
  }, [session, status])

  const fetchFriendsData = async () => {
    if (!session?.user?.id) return

    try {
      const [friendsRes, sentRes, receivedRes, followingRes, followersRes, statsRes] = await Promise.all([
        fetch('/api/friends?type=friends'),
        fetch('/api/friends?type=sent'),
        fetch('/api/friends?type=received'),
        fetch('/api/social/follow?type=following&limit=50'),
        fetch('/api/social/follow?type=followers&limit=50'),
        fetch(`/api/users/${session.user.id}/stats`)
      ])

      if (friendsRes.ok) {
        const friendsData = await friendsRes.json()
        setFriends(friendsData.friends || [])
      }

      if (sentRes.ok) {
        const sentData = await sentRes.json()
        setSentRequests(sentData.requests || [])
      }

      if (receivedRes.ok) {
        const receivedData = await receivedRes.json()
        setReceivedRequests(receivedData.requests || [])

        // Check if there are received requests to show notification
        if (receivedData.requests && receivedData.requests.length > 0) {
          setActiveTab("requests")
        }
      }

      // Fetch following data
      if (followingRes.ok) {
        const followingData = await followingRes.json()
        if (followingData.success) {
          setFollowing(followingData.data)
        }
      }

      if (followersRes.ok) {
        const followersData = await followersRes.json()
        if (followersData.success) {
          setFollowers(followersData.data)
        }
      }

      // Fetch user stats for accurate counts
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setUserStats({
          friendCount: statsData.friendCount || 0,
          followerCount: statsData.followerCount || 0,
          followingCount: statsData.followingCount || 0,
          postCount: statsData.postCount || 0
        })
      }
    } catch (error) {
      console.error('Error fetching friends data:', error)
      toast.error('Failed to load friends data')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' })
      })

      if (response.ok) {
        toast.success('Friend request accepted!')
        fetchFriendsData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to accept request')
      }
    } catch (error) {
      toast.error('Failed to accept request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'decline' })
      })

      if (response.ok) {
        toast.success('Friend request declined')
        fetchFriendsData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to decline request')
      }
    } catch (error) {
      toast.error('Failed to decline request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelRequest = async (requestId: string) => {
    setActionLoading(requestId)
    try {
      const response = await fetch(`/api/friends/requests/${requestId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Friend request cancelled')
        fetchFriendsData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to cancel request')
      }
    } catch (error) {
      toast.error('Failed to cancel request')
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId })
      })

      if (response.ok) {
        toast.success('Friend request sent!')
        fetchFriendsData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to send request')
      }
    } catch (error) {
      toast.error('Failed to send request')
    }
  }

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const response = await fetch(`/api/friends?friendId=${friendId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Friend removed')
        fetchFriendsData() // Refresh data
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to remove friend')
      }
    } catch (error) {
      toast.error('Failed to remove friend')
    }
  }

  const handleStartChat = (friendId: string) => {
    toast.info('Chat feature coming soon!')
  }

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    // Update following state when unfollowing someone
    if (!isFollowing && activeTab === 'following') {
      setFollowing(prev => prev.filter(user => user.id !== userId))
    }

    // Update followers state when following back
    if (isFollowing && activeTab === 'followers') {
      setFollowers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, isFollowing: true } : user
        )
      )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hari ini"
    if (diffDays === 1) return "Kemarin"
    if (diffDays < 7) return `${diffDays} hari lalu`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
    return `${Math.floor(diffDays / 30)} bulan lalu`
  }

  // Show loading spinner while session is loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <Users className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <p className="text-gray-600 mb-6">Please wait while we verify your session.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show sign in prompt if user is not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="mb-4">
              <Users className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to view and manage your friends.</p>
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <h1 className="text-xl font-semibold">Friends</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {userStats.friendCount} Friends
              </Badge>
              <Badge variant="outline" className="text-sm">
                {userStats.followerCount} Followers
              </Badge>
              <Badge variant="outline" className="text-sm">
                {userStats.followingCount} Following
              </Badge>
              {receivedRequests.length > 0 && (
                <Badge variant="destructive" className="text-sm">
                  {receivedRequests.length} Requests
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Friends
              {userStats.friendCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {userStats.friendCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Requests
              {(sentRequests.length + receivedRequests.length) > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {sentRequests.length + receivedRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Following
              {userStats.followingCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {userStats.followingCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="find" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Find Friends
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Suggestions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <FriendList
              friends={friends}
              onRemoveFriend={handleRemoveFriend}
              onStartChat={handleStartChat}
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Received Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Friend Requests ({receivedRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {receivedRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <UserPlus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No friend requests</p>
                    </div>
                  ) : (
                    receivedRequests.map((request) => (
                      <FriendRequestCard
                        key={request.id}
                        request={request}
                        type="received"
                        onAccept={handleAcceptRequest}
                        onDecline={handleDeclineRequest}
                        isLoading={actionLoading === request.id}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Sent Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                Sent Requests ({sentRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sentRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No sent requests</p>
                    </div>
                  ) : (
                    sentRequests.map((request) => (
                      <FriendRequestCard
                        key={request.id}
                        request={request}
                        type="sent"
                        onCancel={handleCancelRequest}
                        isLoading={actionLoading === request.id}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Following & Followers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Following Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Following ({userStats.followingCount})</h3>
                    {following.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada following</p>
                        <p className="text-sm mt-2">Mulai follow pengguna lain untuk melihat mereka di sini</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {following.map((user) => (
                          <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                            <BorderDisplay
                              border={
                                user.border
                                  ? { id: user.border, name: '', imageUrl: user.border, unlocked: true, rarity: 'COMMON' }
                                  : { id: 'default', name: 'Default', imageUrl: '/borders/default.png', unlocked: true, rarity: 'COMMON' }
                              }
                              userAvatar={user.avatar}
                              userName={user.name}
                              size="profile"
                              showUserInfo={true}
                              orientation="horizontal"
                              className="flex-1"
                            />
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">
                                  {user.postCount} postingan
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Following sejak {formatDate(user.followedAt)}
                                </div>
                              </div>
                              <FollowButton
                                targetUserId={user.id}
                                isFollowing={true}
                                onFollowChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
                                size="sm"
                                showIcon={false}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Followers Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Followers ({userStats.followerCount})</h3>
                    {followers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Belum ada followers</p>
                        <p className="text-sm mt-2">Pengguna lain akan muncul di sini ketika mereka mulai follow Anda</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {followers.map((user) => (
                          <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                            <BorderDisplay
                              border={
                                user.border
                                  ? { id: user.border, name: '', imageUrl: user.border, unlocked: true, rarity: 'COMMON' }
                                  : { id: 'default', name: 'Default', imageUrl: '/borders/default.png', unlocked: true, rarity: 'COMMON' }
                              }
                              userAvatar={user.avatar}
                              userName={user.name}
                              size="profile"
                              showUserInfo={true}
                              orientation="horizontal"
                              className="flex-1"
                            />
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">
                                  {user.postCount} postingan
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {user.followerCount} followers
                                </div>
                              </div>
                              <FollowButton
                                targetUserId={user.id}
                                isFollowing={user.isFollowing}
                                onFollowChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
                                size="sm"
                                showIcon={false}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          
          <TabsContent value="find" className="space-y-6">
            <FindFriends
              onSendFriendRequest={handleSendFriendRequest}
            />
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <FriendSuggestions
              onSendFriendRequest={handleSendFriendRequest}
              onRefresh={fetchFriendsData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}