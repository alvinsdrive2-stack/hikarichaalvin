import type { Metadata } from "next"
import Link from "next/link"
import { ForumPostList } from "@/components/forum/forum-post-card"

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
    excerpt: "Saya sering bingung saat memilih matcha. Apa sih perbedaan utama antara matcha ceremonial grade dan culinary grade? Apakah harga yang jauh lebih mahal sepadan dengan kualitasnya?",
    category: "ulasan-produk",
    author: {
      name: "Natsumi Tanaka",
      avatar: "/avatars/natsumi.jpg",
      border: {
        id: "gold",
        name: "Gold",
        image: "/borders/gold.svg",
        rarity: "epic" as const,
        unlocked: true
      },
      role: "Matcha Expert",
      posts: 45,
      joinDate: "Jan 2024"
    },
    createdAt: "2024-10-06T10:30:00Z",
    replies: 12,
    likes: 24,
    views: 156,
    isPinned: true
  },
  {
    id: "t2",
    title: "Cara bikin latte matcha yang creamy",
    excerpt: "Setelah mencoba berbagai resep, akhirnya saya menemukan teknik yang pas untuk latte matcha yang creamy dan tidak pahit. Berbagi tips di sini...",
    category: "resep",
    author: {
      name: "Bima Santoso",
      avatar: "/avatars/bima.jpg",
      border: {
        id: "silver",
        name: "Silver",
        image: "/borders/silver.svg",
        rarity: "rare" as const,
        unlocked: true
      },
      role: "Home Barista",
      posts: 23,
      joinDate: "Feb 2024"
    },
    createdAt: "2024-10-06T08:15:00Z",
    replies: 8,
    likes: 15,
    views: 89
  },
  {
    id: "t3",
    title: "Manfaat L-theanine untuk fokus",
    excerpt: "Ternyata L-theanine dalam matcha memiliki banyak manfaat untuk kesehatan otak. Saya merasakan peningkatan fokus yang signifikan setelah rutin minum matcha...",
    category: "manfaat",
    author: {
      name: "Ayu Wijaya",
      avatar: "/avatars/ayu.jpg",
      border: {
        id: "bronze",
        name: "Bronze",
        image: "/borders/bronze.svg",
        rarity: "common" as const,
        unlocked: true
      },
      role: "Health Enthusiast",
      posts: 12,
      joinDate: "Mar 2024"
    },
    createdAt: "2024-10-05T14:20:00Z",
    replies: 6,
    likes: 9,
    views: 67
  },
  {
    id: "t4",
    title: "Review Matcha dari Berbagai Merek",
    excerpt: "Saya sudah mencoba 5 merek matcha yang berbeda, dari harga 50k hingga 500k. Berikut review lengkapnya...",
    category: "ulasan-produk",
    author: {
      name: "Rina Patel",
      avatar: "/avatars/rina.jpg",
      border: {
        id: "crystal",
        name: "Crystal",
        image: "/borders/crystal.svg",
        rarity: "epic" as const,
        unlocked: true
      },
      role: "Product Reviewer",
      posts: 67,
      joinDate: "Dec 2023"
    },
    createdAt: "2024-10-04T16:45:00Z",
    replies: 23,
    likes: 45,
    views: 234,
    isPinned: true
  },
  {
    id: "t5",
    title: "Teknik Usaha Matcha yang Benar",
    excerpt: "Banyak yang salah kaprah tentang cara usaha matcha. Ini adalah teknik traditional yang saya pelajari langsung dari master tea di Jepang...",
    category: "teknik-seduh",
    author: {
      name: "Kenji Yamamoto",
      avatar: "/avatars/kenji.jpg",
      border: {
        id: "diamond",
        name: "Diamond",
        image: "/borders/diamond.svg",
        rarity: "legendary" as const,
        unlocked: true
      },
      role: "Tea Master",
      posts: 123,
      joinDate: "Nov 2023"
    },
    createdAt: "2024-10-03T09:30:00Z",
    replies: 34,
    likes: 78,
    views: 456,
    isPinned: true
  }
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

      <section aria-labelledby="threads" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="threads" className="text-xl font-semibold">
            Topik Terbaru
          </h2>
          <div className="text-sm text-muted-foreground">
            {THREADS.length} diskusi • {THREADS.reduce((sum, t) => sum + t.replies, 0)} balasan
          </div>
        </div>

        <ForumPostList posts={THREADS} showCategoryFilter={true} />
      </section>
    </div>
  )
}
