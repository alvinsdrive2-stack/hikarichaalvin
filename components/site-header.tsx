"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ShoppingCart, User, Users, Bell, Trophy, Home, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { NavLink } from "@/components/ui/nav-link"
import { cn } from "@/lib/utils"
import { ProfileDropdown } from "@/components/auth/profile-dropdown"
import { toast } from "sonner"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const { count } = useCart()
  const [friendRequestCount, setFriendRequestCount] = useState(0)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)

  // Fetch friend request count and unread messages
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

    const fetchUnreadMessages = async () => {
      try {
        const response = await fetch(`/api/chat/conversations?userId=${session.user.id}`)
        if (response.ok) {
          const data = await response.json()
          const unreadCount = data.data.reduce((total: number, conv: any) => total + (conv.unreadCount || 0), 0)
          setUnreadMessageCount(unreadCount)
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error)
      }
    }

    fetchFriendRequests()
    fetchUnreadMessages()

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchFriendRequests()
      fetchUnreadMessages()
    }, 30000)

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
          {session && (
            <li>
              <NavLink href="/social" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border">
                <Home className="size-4" />
                <span className="hidden sm:inline">Social</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink href="/forum" className="px-3 py-2 rounded-md">
              Forum
            </NavLink>
          </li>
          <li>
            <NavLink href="/marketplace" className="px-3 py-2 rounded-md">
              Marketplace
            </NavLink>
          </li>
          {session && (
            <>
            <li>
              <NavLink href="/friends" className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md border">
                <Users className="size-4" />
                <span className="hidden sm:inline">Friends</span>
                {friendRequestCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 animate-pulse">
                    {friendRequestCount > 99 ? '99+' : friendRequestCount}
                  </Badge>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink href="/chat" className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md border">
                <MessageSquare className="size-4" />
                <span className="hidden sm:inline">Chat</span>
                {unreadMessageCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 animate-pulse">
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </Badge>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink href="/achievements" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border">
                <Trophy className="size-4" />
                <span className="hidden sm:inline">Achievements</span>
              </NavLink>
            </li>
            </>
          )}
            <li>
            <NavLink href="/marketplace#cart" className={cn("inline-flex items-center gap-2 px-3 py-2 rounded-md border")}>
              <ShoppingCart className="size-4" />
              <span className="sr-only">{"Jumlah item di keranjang"}</span>
              <span aria-live="polite" className="min-w-[1rem] text-center">{count}</span>
            </NavLink>
          </li>
          <li>
            {session ? (
              <ProfileDropdown />
            ) : (
              <NavLink href="/auth/login" className="inline-flex items-center gap-2 px-3 py-2 rounded-md border active:scale-95">
                <User className="size-4" />
                <span className="hidden sm:inline">Login/Register</span>
                <span className="sm:hidden">Login</span>
              </NavLink>
            )}
          </li>
        </ul>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur animate-in slide-in-from-top-2 duration-300">
          <ul className="px-4 py-3 flex flex-col gap-3">
            {session && (
              <li>
                <NavLink href="/social" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md">
                  <Home className="size-4" />
                  <span>Social</span>
                </NavLink>
              </li>
            )}
            <li>
              <NavLink href="/forum" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md">
                Forum
              </NavLink>
            </li>
            <li>
              <NavLink href="/marketplace" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md">
                Marketplace
              </NavLink>
            </li>
            {session && (
              <>
              <li>
                <NavLink href="/friends" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md">
                  <Users className="size-4" />
                  <span>Friends</span>
                  {friendRequestCount > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      {friendRequestCount > 99 ? '99+' : friendRequestCount}
                    </Badge>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink href="/chat" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md relative">
                  <MessageSquare className="size-4" />
                  <span>Chat</span>
                  {unreadMessageCount > 0 && (
                    <Badge variant="destructive" className="text-xs animate-pulse">
                      {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                    </Badge>
                  )}
                </NavLink>
              </li>
              <li>
                <NavLink href="/achievements" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-md">
                  <Trophy className="size-4" />
                  <span>Achievements</span>
                </NavLink>
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
                <NavLink href="/auth/login" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border active:scale-95">
                  <User className="size-4" />
                  Login/Register
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
