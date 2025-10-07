"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"
import { AuthModal } from "@/components/auth/auth-modal"
import { ProfileDropdown } from "@/components/auth/profile-dropdown"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { data: session } = useSession()
  const { count } = useCart()

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <nav aria-label="Navigasi utama" className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <span aria-hidden className="size-6 rounded-md bg-primary" title="HikariCha" />
            <span className="font-medium">HikariCha</span>
          </Link>
        </div>

        <button
          aria-label="Buka menu"
          className="md:hidden px-3 py-2 rounded-md border"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link href="/forum" className="hover:underline">
              Forum
            </Link>
          </li>
          <li>
            <Link href="/marketplace" className="hover:underline">
              Marketplace
            </Link>
          </li>
            <li>
            <Link href="/marketplace#cart" className={cn("inline-flex items-center gap-2 px-3 py-2 rounded-md border")}>
              <ShoppingCart className="size-4" />
              <span className="sr-only">{"Jumlah item di keranjang"}</span>
              <span aria-live="polite">{count}</span>
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
                className="inline-flex items-center gap-2"
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
        <div className="md:hidden border-t">
          <ul className="px-4 py-3 flex flex-col gap-3">
            <li>
              <Link href="/forum" onClick={() => setOpen(false)}>
                Forum
              </Link>
            </li>
            <li>
              <Link href="/marketplace" onClick={() => setOpen(false)}>
                Marketplace
              </Link>
            </li>
              <li className="flex items-center gap-2">
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
                  className="inline-flex items-center gap-2"
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
