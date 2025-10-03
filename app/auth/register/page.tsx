import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata: Metadata = {
  title: "Daftar — HikariCha",
  description: "Buat akun HikariCha.",
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Daftar</h1>
      <form className="space-y-4" aria-label="Form daftar">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="nama@contoh.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Kata Sandi</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" disabled aria-disabled>
          Daftar (nonaktif)
        </Button>
      </form>
      <p className="text-sm text-muted-foreground mt-4">
        Sudah punya akun?{" "}
        <Link className="underline" href="/auth/login">
          Masuk
        </Link>
      </p>
      <p className="text-xs text-muted-foreground mt-2">Autentikasi akan aktif setelah integrasi Supabase dipasang.</p>
    </div>
  )
}
