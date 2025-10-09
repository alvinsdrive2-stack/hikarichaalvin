"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MessageSquare, Heart, Calendar, Trophy } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  points: number
  role?: string
  bio?: string
  createdAt: string
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
  const [loading, setLoading] = useState(true)

  const isOwnProfile = session?.user?.id === userId

  useEffect(() => {
    if (userId) {
      fetchUserData()
    }
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/achievements/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setAchievements(data.achievements)
      } else {
        toast.error("User not found")
        router.push("/")
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
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 text-center">
                  <Badge variant="outline" className="text-xs">
                    {user.role || 'Member'}
                  </Badge>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-600 mb-2">{user.email}</p>
                {user.bio && (
                  <p className="text-gray-700 mb-4 max-w-2xl">{user.bio}</p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDate(user.createdAt)}
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4" />
                    {user.points} Points
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {isOwnProfile ? (
                  <Button onClick={() => router.push("/profile")}>
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="outline">
                    Message
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Achievements */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
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