"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BorderPreview } from "@/components/ui/border-preview"
import { useProfileRealtime } from "@/hooks/useProfileRealtime"
import { User, LogOut, ShoppingBag, Coins, Star } from "lucide-react"

export function ProfileDropdown() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  // Use real-time profile hook
  const { userBorder, userPoints, fetchProfileData } = useProfileRealtime()

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchProfileData()
    }

    // Listen for custom events from profile page
    window.addEventListener('profile-updated', handleProfileUpdate)
    window.addEventListener('border-updated', handleProfileUpdate)
    window.addEventListener('points-updated', handleProfileUpdate)

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate)
      window.removeEventListener('border-updated', handleProfileUpdate)
      window.removeEventListener('points-updated', handleProfileUpdate)
    }
  }, [fetchProfileData])

  
  if (!session) {
    return null
  }

  const userInitials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Logout berhasil!")
    } catch (error) {
      toast.error("Gagal logout")
    }
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)

    // Refresh data when opening dropdown
    if (newIsOpen && session?.user) {
      fetchProfileData()
    }
  }

  const handleMenuItemClick = (action: string) => {
    setIsOpen(false)

    if (action === 'logout') {
      handleLogout()
    }
    // TODO: Add navigation for other menu items
    if (action === 'profile') {
      // Navigate to profile page
      window.location.href = '/profile'
    }
    if (action === 'orders') {
      // Navigate to orders page
      window.location.href = '/orders'
    }
  }

  return (
    <div className="relative">
      {/* Avatar Button with Border */}
      <Button
        variant="ghost"
        className="relative h-12 w-12 rounded-full hover:bg-gray-100 transition-colors p-0 items-center justify-center"
        aria-label="User menu"
        onClick={handleButtonClick}
      >
        {userBorder ? (
          <BorderPreview
            border={userBorder}
            size="lg"
            avatarSrc={session.user?.image || ""}
            avatarName={session.user?.name || ""}
            showLabel={false}
            showLockStatus={false}
          />
        ) : (
          <Avatar className="h-10 w-10">
            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-md shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info Header with Border */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-3">
                {userBorder ? (
                  <BorderPreview
                    border={userBorder}
                    size="md"
                    avatarSrc={session.user?.image || ""}
                    avatarName={session.user?.name || ""}
                    showLabel={false}
                    showLockStatus={false}
                  />
                ) : (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>

                  {/* Border Info with Rarity */}
                  {userBorder && (
                    <div className="flex items-center gap-1 mt-1">
                      <Star className={`h-3 w-3 ${
                        userBorder.name === 'Bronze' ? 'text-amber-700' :
                        userBorder.name === 'Silver' ? 'text-zinc-300' :
                        userBorder.name === 'Gold' ? 'text-amber-400' :
                        userBorder.rarity === 'Default' ? 'text-gray-400' :
                        userBorder.rarity === 'Common' ? 'text-gray-500' :
                        userBorder.rarity === 'Uncommon' ? 'text-emerald-400' :
                        userBorder.rarity === 'Rare' ? 'text-sky-400' :
                        userBorder.rarity === 'Epic' ? 'text-violet-400' :
                        userBorder.rarity === 'Legendary' ? 'text-amber-500' :
                        userBorder.rarity === 'Mythic' ? 'text-rose-500' :
                        'text-gray-500'
                      }`} />
                      <p className={`text-xs ${
                        userBorder.name === 'Bronze' ? 'text-amber-700' :
                        userBorder.name === 'Silver' ? 'text-zinc-300' :
                        userBorder.name === 'Gold' ? 'text-amber-400' :
                        userBorder.rarity === 'Default' ? 'text-gray-400' :
                        userBorder.rarity === 'Common' ? 'text-gray-500' :
                        userBorder.rarity === 'Uncommon' ? 'text-emerald-400' :
                        userBorder.rarity === 'Rare' ? 'text-sky-400' :
                        userBorder.rarity === 'Epic' ? 'text-violet-400' :
                        userBorder.rarity === 'Legendary' ? 'text-amber-500' :
                        userBorder.rarity === 'Mythic' ? 'text-rose-500' :
                        'text-gray-500'
                      }`}>
                        {userBorder.name}
                      </p>

                    </div>
                  )}
                </div>
              </div>

              {/* Points Display */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{userPoints.toLocaleString()} Points</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-3 text-sm"
                onClick={() => handleMenuItemClick('profile')}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>

              <button
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-3 text-sm"
                onClick={() => handleMenuItemClick('orders')}
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Pesanan Saya</span>
              </button>

              <div className="border-t border-border my-1"></div>

              <button
                className="w-full px-3 py-2 text-left hover:bg-accent hover:text-destructive flex items-center gap-3 text-sm text-destructive"
                onClick={() => handleMenuItemClick('logout')}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          {/* Backdrop for clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}