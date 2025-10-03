import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Profil — HikariCha",
  description: "Kelola profil, tingkatkan membership, dan lihat pencapaian Anda.",
}

const TIERS = [
  { id: "bronze", name: "Bronze", price: 30000, benefits: ["Badge Bronze"] },
  { id: "silver", name: "Silver", price: 75000, benefits: ["Badge Silver", "Prioritas Forum"] },
  { id: "gold", name: "Gold", price: 150000, benefits: ["Badge Gold", "Prioritas Forum", "Diskon Marketplace"] },
]

const BADGES = ["Resep Pertama", "20 Diskusi", "Pembelian 3x"]

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Profil Anda</h1>
        <p className="text-sm text-muted-foreground">
          Personalisasi akun, lihat riwayat pembelian, dan upgrade keanggotaan.
        </p>
      </header>

      <section aria-labelledby="achievements" className="space-y-3">
        <h2 id="achievements" className="text-xl font-semibold">
          Pencapaian
        </h2>
        <ul className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <li key={b} className="px-3 py-1 rounded-md border bg-secondary">
              {b}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tiers" className="space-y-4">
        <h2 id="tiers" className="text-xl font-semibold">
          Upgrade Membership
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((t) => (
            <div key={t.id} className="rounded-lg border p-4 space-y-3">
              <h3 className="font-medium">{t.name}</h3>
              <p className="text-sm text-muted-foreground">Rp{t.price.toLocaleString("id-ID")}</p>
              <ul className="text-sm list-disc pl-5">
                {t.benefits.map((bf) => (
                  <li key={bf}>{bf}</li>
                ))}
              </ul>
              <Button disabled aria-disabled title="Aktifkan setelah integrasi Stripe">
                Upgrade (nonaktif)
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Untuk mengaktifkan pembayaran upgrade, hubungkan Stripe di pengaturan proyek.
        </p>
      </section>
    </div>
  )
}
