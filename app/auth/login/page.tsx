"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Email atau password salah")
      } else {
        toast.success("Login berhasil!")
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Masuk</h1>
        <p className="text-muted-foreground mt-2">Selamat datang kembali di HikariCha!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" aria-label="Form masuk">
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
            required
            disabled={isLoading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Masuk...
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </form>

      <div className="text-center mt-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link className="underline hover:text-primary" href="/auth/register">
            Daftar
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