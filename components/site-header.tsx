"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
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
            <Link href="/profile" className="hover:underline">
              Profil
            </Link>
          </li>
          <li>
            <Link href="/auth/login" className="hover:underline">
              Masuk
            </Link>
          </li>
          <li>
            <Link href="/auth/register" className="hover:underline">
              Daftar
            </Link>
          </li>
          <li>
            <Link href="/marketplace#cart" className={cn("inline-flex items-center gap-2 px-3 py-2 rounded-md border")}>
              <ShoppingCart className="size-4" />
              <span className="sr-only">{"Jumlah item di keranjang"}</span>
              <span aria-live="polite">{count}</span>
            </Link>
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
            <li>
              <Link href="/profile" onClick={() => setOpen(false)}>
                Profil
              </Link>
            </li>
            <li className="flex gap-2">
              <Link href="/auth/login" onClick={() => setOpen(false)}>
                <Button variant="outline" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setOpen(false)}>
                <Button size="sm">Daftar</Button>
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <ShoppingCart className="size-4" />
              <span aria-live="polite">Keranjang: {count}</span>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
