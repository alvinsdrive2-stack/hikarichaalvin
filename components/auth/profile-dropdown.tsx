"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, ShoppingBag } from "lucide-react"

export function ProfileDropdown() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

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
      {/* Avatar Button */}
      <Button
        variant="ghost"
        className="relative h-10 w-10 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="User menu"
        onClick={handleButtonClick}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-md shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User Info Header */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium text-sm">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
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