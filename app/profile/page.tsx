"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BorderPreview } from "@/components/ui/border-preview"
import { BorderSelector } from "@/components/ui/border-selector"
import { BorderDisplay } from "@/components/ui/border-display"
import { Loader2, User, MapPin, Calendar, Settings, Camera, Save, Edit2, Check, X, Palette, Star, MessageSquare, MessageCircle, ChefHat, Heart, ShoppingCart, Activity } from "lucide-react"

// Dummy data untuk testing
const dummyActivities = [
  {
    id: "dummy-1",
    type: "FORUM_POST",
    title: "Membuat postingan baru di forum",
    description: "Resep Ayam Bakar Madura",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 jam lalu
  },
  {
    id: "dummy-2",
    type: "RECIPE_CREATED",
    title: "Resep baru ditambahkan",
    description: "Soto Ayam Kuah Kuning",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 hari lalu
  },
  {
    id: "dummy-3",
    type: "FORUM_COMMENT",
    title: "Berkomentar di forum",
    description: "Tips memasak nasi goreng yang enak",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 hari lalu
  },
  {
    id: "dummy-4",
    type: "BADGE_EARNED",
    title: "Badge baru didapatkan",
    description: "Member Aktif - 10 postingan forum",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() // 3 hari lalu
  },
  {
    id: "dummy-5",
    type: "RECIPE_LIKED",
    title: "Resep kamu disukai",
    description: "10 orang menyukai resep Soto Ayam kamu",
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString() // 5 hari lalu
  }
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activities, setActivities] = useState<any[]>([])
  const [unlockedBorders, setUnlockedBorders] = useState<string[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [achievements, setAchievements] = useState<any[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    selectedBorder: "default"
  })

  // Base border options with svg images
  const baseBorderOptions = [
    {
      id: "default",
      name: "Default",
      image: "/borders/default.svg",
      rarity: "common" as const
    },
    {
      id: "bronze",
      name: "Bronze",
      image: "/borders/bronze.svg",
      rarity: "common" as const
    },
    {
      id: "silver",
      name: "Silver",
      image: "/borders/silver.svg",
      rarity: "rare" as const
    },
    {
      id: "gold",
      name: "Gold",
      image: "/borders/gold.svg",
      rarity: "epic" as const
    },
    {
      id: "crystal",
      name: "Crystal",
      image: "/borders/crystal.svg",
      rarity: "epic" as const
    },
    {
      id: "diamond",
      name: "Diamond",
      image: "/borders/diamond.svg",
      rarity: "legendary" as const
    },
  ]

  // Update border options with unlock status from database
  const borderOptions = baseBorderOptions.map(border => ({
    ...border,
    unlocked: unlockedBorders.includes(border.id) || border.id === "default" // Default is always unlocked
  }))

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
      fetchUserActivities()
      fetchUserBorders()
      fetchUserAchievements()
    }
  }, [session])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          location: data.user.location || "",
          selectedBorder: data.user.selectedBorder || "default"
        })
      }
    } catch (error) {
      toast.error("Gagal memuat profil")
    }
  }

  const fetchUserActivities = async () => {
    try {
      const response = await fetch("/api/activities")
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
      }
    } catch (error) {
      console.error("Gagal memuat aktivitas:", error)
    }
  }

  const fetchUserBorders = async () => {
    try {
      const response = await fetch("/api/borders")
      if (response.ok) {
        const data = await response.json()
        setUnlockedBorders(data.borders.map((b: any) => b.borderName) || [])
      }
    } catch (error) {
      console.error("Gagal memuat borders:", error)
    }
  }

  const fetchUserAchievements = async () => {
    try {
      const response = await fetch("/api/achievements")
      if (response.ok) {
        const data = await response.json()
        setAchievements(data.achievements || [])
        setUserPoints(data.userPoints || 0)
      }
    } catch (error) {
      console.error("Gagal memuat achievements:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/profile/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        toast.success("Foto profil berhasil diperbarui!")

        // Clear the file input
        e.target.value = ''

        // Refresh the session and page to show the new image
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Gagal mengupload foto")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Terjadi kesalahan saat upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success("Profil berhasil diperbarui!")
        setIsEditing(false)
        fetchUserProfile()
      } else {
        toast.error("Gagal memperbarui profil")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBorderSelect = (borderId: string) => {
    const border = borderOptions.find(b => b.id === borderId)
    if (border?.unlocked) {
      setFormData(prev => ({ ...prev, selectedBorder: borderId }))
    } else {
      toast.error("Border ini belum terbuka! Raih lebih banyak poin untuk membukanya.")
    }
  }

  const getSelectedBorder = () => {
    return borderOptions.find(b => b.id === formData.selectedBorder) || borderOptions[0]
  }

  const getUserInitials = () => {
    return formData.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'FORUM_POST': return <MessageSquare className="h-4 w-4" />
      case 'FORUM_COMMENT': return <MessageCircle className="h-4 w-4" />
      case 'RECIPE_CREATED': return <ChefHat className="h-4 w-4" />
      case 'RECIPE_LIKED': return <Heart className="h-4 w-4" />
      case 'PURCHASE': return <ShoppingCart className="h-4 w-4" />
      case 'PROFILE_UPDATE': return <User className="h-4 w-4" />
      case 'BADGE_EARNED': return <Star className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <p className="text-muted-foreground">Kelola profil dan lihat aktivitas terbaru</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto w-fit">
                <BorderPreview
                  border={getSelectedBorder()}
                  size="2xl"
                  avatarSrc={session.user?.image || ""}
                  avatarName={session.user?.name || ""}
                  showLabel={false}
                  showLockStatus={false}
                />
                {/* Camera Button */}
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90 z-20">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </label>
                )}
              </div>
              <CardTitle className="text-xl mt-4">{formData.name || "User"}</CardTitle>
              <CardDescription>{session.user?.email}</CardDescription>
              {formData.location && (
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {formData.location}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {formData.bio && (
                <p className="text-sm text-center text-muted-foreground mb-4">
                  {formData.bio}
                </p>
              )}

              <div className="flex justify-center">
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isLoading}
                >
                  {isEditing ? (
                    <>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Simpan
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profil
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Statistik</CardTitle>
              <CardDescription className="text-xs text-green-600">✅ Terkoneksi database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Forum Post</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Resep Dibuat</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pembelian</span>
                <Badge variant="secondary">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Poin</span>
                <Badge variant="default">{userPoints}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="activity">Aktivitas</TabsTrigger>
              <TabsTrigger value="customization">Kustomisasi</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profil</CardTitle>
                  <CardDescription>
                    {isEditing ? "Edit informasi profil Anda" : "Informasi dasar profil Anda"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={session.user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Kota, Negara"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Ceritakan tentang diri Anda..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>Riwayat aktivitas Anda di platform</CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.title}</p>
                            {activity.description && (
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {/* Dummy activities untuk testing */}
                      <div className="mt-6 pt-4 border-t">
                        <p className="text-xs text-orange-600 mb-3">🔧 Data dummy untuk testing:</p>
                        {dummyActivities.map((activity, index) => (
                          <div key={`dummy-${index}`} className="flex items-start space-x-4 p-3 rounded-lg border border-orange-200 bg-orange-50/30">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{activity.title}</p>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(activity.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada aktivitas</p>
                      <p className="text-xs text-orange-600 mt-2">🔧 Data dummy ditampilkan di bawah untuk testing</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Kustomisasi Profil
                  </CardTitle>
                  <CardDescription>Personalisasi tampilan profil Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Border Foto Profil</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Pilih border untuk foto profil Anda. Beberapa border membutuhkan poin untuk membuka.
                    </p>
                    <p className="text-xs text-green-600 mb-3">✅ Kepemilikan border dari database</p>
                    <BorderSelector
                      borders={borderOptions}
                      selectedBorder={formData.selectedBorder}
                      onSelect={handleBorderSelect}
                      size="lg"
                      columns={3}
                      showRarity={true}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Badge & Achievements</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    Badge yang telah Anda dapatkan
                    <span className="text-xs text-orange-600">🔧 Data dummy</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Member Baru
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Aktif Forum
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ChefHat className="h-3 w-3" />
                      Pembuat Resep
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      Populer
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <ShoppingCart className="h-3 w-3" />
                      Pembeli Setia
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                      <Star className="h-3 w-3" />
                      Master Chef (Terkunci)
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Pengaturan Akun
                  </CardTitle>
                  <CardDescription>Kelola pengaturan akun dan privasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Notifikasi Email</p>
                      <p className="text-sm text-muted-foreground">Terima update via email</p>
                      <p className="text-xs text-orange-600">🔧 Fitur dummy - belum terkoneksi</p>
                    </div>
                    <Button variant="outline" size="sm">Atur</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Privasi Profil</p>
                      <p className="text-sm text-muted-foreground">Atur siapa yang bisa lihat profil</p>
                      <p className="text-xs text-orange-600">🔧 Fitur dummy - belum terkoneksi</p>
                    </div>
                    <Button variant="outline" size="sm">Atur</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Keamanan</p>
                      <p className="text-sm text-muted-foreground">Password dan autentikasi</p>
                      <p className="text-xs text-orange-600">🔧 Fitur dummy - belum terkoneksi</p>
                    </div>
                    <Button variant="outline" size="sm">Atur</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50/30">
                    <div>
                      <p className="font-medium">Preferensi Tema</p>
                      <p className="text-sm text-muted-foreground">Dark/Light mode (segera)</p>
                      <p className="text-xs text-orange-600">🔧 Akan datang</p>
                    </div>
                    <Button variant="outline" size="sm" disabled>Coming Soon</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}