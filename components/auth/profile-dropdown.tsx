"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BorderPreview } from "@/components/ui/border-preview"
import { User, LogOut, ShoppingBag } from "lucide-react"

export function ProfileDropdown() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [userBorder, setUserBorder] = useState<any>(null)

  // Fetch user border data
  useEffect(() => {
    if (session?.user) {
      fetchUserBorder()
    }
  }, [session])

  const fetchUserBorder = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        if (data.user.selectedBorder) {
          // Base border options
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

          const border = baseBorderOptions.find(b => b.id === data.user.selectedBorder)
          setUserBorder(border || baseBorderOptions[0])
        }
      }
    } catch (error) {
      console.error("Error fetching user border:", error)
    }
  }

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
    setIsOpen(!isOpen)
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
                  {userBorder && (
                    <p className="text-xs text-muted-foreground">Border: {userBorder.name}</p>
                  )}
                </div>
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