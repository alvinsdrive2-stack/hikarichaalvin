"use client"

import { useState } from "react"
import { SocialFeed } from "@/components/social/social-feed/social-feed"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Home, TrendingUp, Users, Bookmark } from "lucide-react"
import Link from "next/link"

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("home")

  const tabs = [
    { id: "home", label: "Beranda", icon: Home, href: "/social" },
    { id: "trending", label: "Trending", icon: TrendingUp, href: "/social/trending" },
    { id: "following", label: "Diikuti", icon: Users, href: "/social/following" },
    { id: "bookmarks", label: "Tersimpan", icon: Bookmark, href: "/social/bookmarks" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Komunitas Sosial
          </h1>
          <p className="text-muted-foreground">
            Terhubung dengan komunitas pecinta matcha dan teh Jepang
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <Link key={tab.id} href={tab.href}>
                  <Button
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 rounded-md transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.charAt(0)}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <SocialFeed />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistik Komunitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Postingan Hari Ini</span>
                  <Badge variant="secondary">42</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pengguna Aktif</span>
                  <Badge variant="secondary">256</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Komentar</span>
                  <Badge variant="secondary">1.2K</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Suka</span>
                  <Badge variant="secondary">3.8K</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Topik Populer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { tag: "#MatchaTips", count: 89 },
                  { tag: "#TehJepang", count: 67 },
                  { tag: "#ResepMatcha", count: 45 },
                  { tag: "#KulturJepang", count: 34 },
                  { tag: "#CeritaTeh", count: 28 },
                ].map((topic) => (
                  <div key={topic.tag} className="flex items-center justify-between">
                    <span className="text-sm font-medium hover:text-primary cursor-pointer transition-colors">
                      {topic.tag}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {topic.count} postingan
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/forum">
                    Kunjungi Forum
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/marketplace">
                    Jelajahi Marketplace
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/achievements">
                    Lihat Pencapaian
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}