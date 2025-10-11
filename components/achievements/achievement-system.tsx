"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Lock, Unlock, Award, Target } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { FlexibleAvatar } from "@/components/ui/flexible-avatar";
import { useUserBorder } from "@/hooks/useUserBorder";

interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: string;
  rewards: {
    points: number;
    border?: string;
  };
}

interface AchievementCategory {
  name: string;
  achievements: Achievement[];
  icon: React.ReactNode;
  color: string;
}

export function AchievementSystem() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { border: userBorder } = useUserBorder(session?.user?.id || "");

  useEffect(() => {
    if (session?.user?.id) {
      fetchAchievements();
    }
  }, [session]);

  const fetchAchievements = async () => {
    try {
      const response = await fetch("/api/achievements");
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Gagal memuat achievements");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = (): AchievementCategory[] => {
    const categories = {
      forum: {
        name: "Forum",
        achievements: achievements.filter(a =>
          ["FIRST_FORUM_POST", "FORUM_REGULAR", "FORUM_EXPERT", "DISCUSSION_STARTER"].includes(a.type)
        ),
        icon: <Trophy className="h-5 w-5" />,
        color: "bg-blue-500"
      },
      social: {
        name: "Sosial",
        achievements: achievements.filter(a =>
          ["SOCIAL_BUTTERFLY", "FRIEND_COLLECTOR"].includes(a.type)
        ),
        icon: <Star className="h-5 w-5" />,
        color: "bg-green-500"
      },
      engagement: {
        name: "Engagement",
        achievements: achievements.filter(a =>
          ["HELPFUL_MEMBER", "COMMENTATOR_PRO", "ACTIVE_MEMBER"].includes(a.type)
        ),
        icon: <Award className="h-5 w-5" />,
        color: "bg-purple-500"
      },
      collection: {
        name: "Koleksi",
        achievements: achievements.filter(a =>
          ["BORDER_COLLECTOR", "POINTS_COLLECTOR"].includes(a.type)
        ),
        icon: <Target className="h-5 w-5" />,
        color: "bg-orange-500"
      }
    };

    return Object.values(categories);
  };

  const getTotalProgress = () => {
    const completed = achievements.filter(a => a.isCompleted).length;
    const total = achievements.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getTotalPoints = () => {
    return achievements
      .filter(a => a.isCompleted)
      .reduce((sum, a) => sum + (a.rewards?.points || 0), 0);
  };

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
    const progress = (achievement.currentValue / achievement.targetValue) * 100;

    return (
      <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
        achievement.isCompleted
          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
          : 'bg-white border-gray-200'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                achievement.isCompleted
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {achievement.isCompleted ? (
                  <Trophy className="h-6 w-6" />
                ) : (
                  <Lock className="h-6 w-6" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">
                  {achievement.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {achievement.description}
                </p>
              </div>
            </div>
            {achievement.isCompleted && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Unlock className="h-3 w-3 mr-1" />
                Selesai
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {achievement.currentValue} / {achievement.targetValue}
                </span>
              </div>
              <Progress
                value={progress}
                className={`h-2 ${
                  achievement.isCompleted
                    ? 'bg-yellow-100'
                    : 'bg-gray-100'
                }`}
              />
            </div>

            {(achievement.rewards?.points || achievement.rewards?.border) && (
              <div className="flex items-center gap-2 pt-2 border-t">
                {achievement.rewards?.points && (
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium text-yellow-700">
                      +{achievement.rewards.points} poin
                    </span>
                  </div>
                )}
                {achievement.rewards?.border && (
                  <Badge variant="outline" className="text-xs">
                    Border: {achievement.rewards.border}
                  </Badge>
                )}
              </div>
            )}

            {achievement.completedAt && (
              <div className="text-xs text-gray-500 pt-2 border-t">
                Diselesaikan: {new Date(achievement.completedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = getCategories();
  const progress = getTotalProgress();
  const totalPoints = getTotalPoints();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header dengan User Profile */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <FlexibleAvatar
                  src={session?.user?.image}
                  name={session?.user?.name}
                  userBorder={userBorder}
                  size="xl"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Achievement System
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Tingkatkan level dan dapatkan reward dari aktivitasmu di forum
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {progress.completed}/{progress.total}
                      </div>
                      <div className="text-sm text-gray-600">Achievements</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {totalPoints}
                      </div>
                      <div className="text-sm text-gray-600">Total Poin</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {progress.percentage.toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Progress</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Progress Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress.percentage} className="h-4 mb-4" />
              <div className="flex justify-between text-sm">
                <span>{progress.completed} achievements completed</span>
                <span>{progress.total - progress.completed} remaining</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Semua</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                <div className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category.name} value={category.name.toLowerCase()} className="space-y-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <div className={`p-2 rounded-lg text-white ${category.color}`}>
                    {category.icon}
                  </div>
                  {category.name} Achievements
                </h2>
                <p className="text-gray-600 mt-2">
                  {category.achievements.filter(a => a.isCompleted).length} dari {category.achievements.length} achievements selesai
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}