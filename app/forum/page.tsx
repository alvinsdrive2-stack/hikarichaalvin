import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forum Matcha — HikariCha",
  description: "Diskusi seputar manfaat kesehatan, teknik seduh, dan ulasan produk matcha.",
}

const CATEGORIES = [
  { slug: "manfaat", name: "Manfaat Kesehatan" },
  { slug: "teknik-seduh", name: "Teknik Seduh" },
  { slug: "ulasan-produk", name: "Ulasan Produk" },
  { slug: "resep", name: "Resep" },
]

const THREADS = [
  {
    id: "t1",
    title: "Ceremonial vs Culinary: apa bedanya?",
    category: "ulasan-produk",
    author: "natsumi",
  },
  {
    id: "t2",
    title: "Cara bikin latte matcha yang creamy",
    category: "resep",
    author: "bima",
  },
  {
    id: "t3",
    title: "Manfaat L-theanine untuk fokus",
    category: "manfaat",
    author: "ayu",
  },
]

export default function ForumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Forum HikariCha</h1>
        <p className="text-sm text-muted-foreground">Bertanya, berbagi, dan berdiskusi seputar matcha.</p>
        <p className="text-xs text-muted-foreground">Daftar/Masuk untuk membuat topik dan menautkan profil Anda.</p>
      </header>

      <section aria-labelledby="cats" className="space-y-3">
        <h2 id="cats" className="text-xl font-semibold">
          Kategori
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`#${c.slug}`} className="px-3 py-1 rounded-md border bg-secondary">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="threads" className="space-y-3">
        <h2 id="threads" className="text-xl font-semibold">
          Topik Terbaru
        </h2>
        <ul className="space-y-3">
          {THREADS.map((t) => (
            <li key={t.id} className="rounded-lg border p-4">
              <h3 className="font-medium text-pretty">{t.title}</h3>
              <p className="text-sm text-muted-foreground">
                Kategori: {t.category} • oleh {t.author}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
