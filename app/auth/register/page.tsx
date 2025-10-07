"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      toast.error("Password harus minimal 6 karakter")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Registrasi gagal")
      } else {
        toast.success("Registrasi berhasil! Silakan login.")
        router.push("/auth/login")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat registrasi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Daftar</h1>
        <p className="text-muted-foreground mt-2">Buat akun baru di HikariCha!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Form daftar">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@contoh.com"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 6 karakter"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Ulangi kata sandi"
            required
            minLength={6}
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </Button>
      </form>

      <div className="text-center mt-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link className="underline hover:text-primary" href="/auth/login">
            Masuk
          </Link>
        </p>
        <p className="text-sm">
          <Link className="text-muted-foreground hover:text-primary" href="/">
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </div>
  )
}