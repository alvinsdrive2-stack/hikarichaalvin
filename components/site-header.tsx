"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ShoppingCart, User, Users, Bell, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"
import { AuthModal } from "@/components/auth/auth-modal"
import { ProfileDropdown } from "@/components/auth/profile-dropdown"
import { toast } from "sonner"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { data: session } = useSession()
  const { count } = useCart()
  const [friendRequestCount, setFriendRequestCount] = useState(0)

  // Fetch friend request count
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchFriendRequests = async () => {
      try {
        const response = await fetch('/api/friends?type=received')
        if (response.ok) {
          const data = await response.json()
          setFriendRequestCount(data.requests?.length || 0)
        }
      } catch (error) {
        console.error('Error fetching friend requests:', error)
      }
    }

    fetchFriendRequests()

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchFriendRequests, 30000)

    return () => clearInterval(interval)
  }, [session])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-all duration-300">
      <nav aria-label="Navigasi utama" className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span aria-hidden className="size-6 rounded-md bg-gradient-to-br from-primary to-primary/80 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105" title="HikariCha" />
            <span className="font-medium group-hover:text-primary transition-colors duration-200">HikariCha</span>
          </Link>
        </div>

        <button
          aria-label="Buka menu"
          className="md:hidden px-3 py-2 rounded-md border hover:bg-muted/50 transition-colors duration-200 active:scale-95 transform"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link href="/forum" className="px-3 py-2 rounded-md hover:bg-muted/50 transition-all duration-200 hover:scale-105 transform">
              Forum
            </Link>
          </li>
          <li>
            <Link href="/marketplace" className="px-3 py-2 rounded-md hover:bg-muted/50 transition-all duration-200 hover:scale-105 transform">
              Marketplace
            </Link>
          </li>
          {session && (
            <>
            <li>
              <Link href="/friends" className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted/50 transition-all duration-200 hover:scale-105 transform hover:shadow-md">
                <Users className="size-4" />
                <span className="hidden sm:inline">Friends</span>
                {friendRequestCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 animate-pulse">
                    {friendRequestCount > 99 ? '99+' : friendRequestCount}
                  </Badge>
                )}
              </Link>
            </li>
            <li>
              <Link href="/achievements" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted/50 transition-all duration-200 hover:scale-105 transform hover:shadow-md">
                <Trophy className="size-4" />
                <span className="hidden sm:inline">Achievements</span>
              </Link>
            </li>
            </>
          )}
            <li>
            <Link href="/marketplace#cart" className={cn("inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-muted/50 transition-all duration-200 hover:scale-105 transform hover:shadow-md")}>
              <ShoppingCart className="size-4" />
              <span className="sr-only">{"Jumlah item di keranjang"}</span>
              <span aria-live="polite" className="min-w-[1rem] text-center">{count}</span>
            </Link>
          </li>
          <li>
            {session ? (
              <ProfileDropdown />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200 hover:shadow-md active:scale-95"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Login/Register</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </li>
        </ul>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top-2 duration-300">
          <ul className="px-4 py-3 flex flex-col gap-3">
            <li>
              <Link href="/forum" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                Forum
              </Link>
            </li>
            <li>
              <Link href="/marketplace" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                Marketplace
              </Link>
            </li>
            {session && (
              <>
              <li>
                <Link href="/friends" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                  <Users className="size-4" />
                  <span>Friends</span>
                  {friendRequestCount > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      {friendRequestCount > 99 ? '99+' : friendRequestCount}
                    </Badge>
                  )}
                </Link>
              </li>
              <li>
                <Link href="/achievements" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
                  <Trophy className="size-4" />
                  <span>Achievements</span>
                </Link>
              </li>
              </>
            )}
              <li className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted/50 transition-colors duration-200">
              <ShoppingCart className="size-4" />
              <span aria-live="polite">Keranjang: {count}</span>
            </li>
            <li>
              {session ? (
                <ProfileDropdown />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowAuthModal(true)
                    setOpen(false)
                  }}
                  className="inline-flex items-center gap-2 hover:scale-105 transform transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  <User className="size-4" />
                  Login/Register
                </Button>
              )}
            </li>
          </ul>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </header>
  )
}
