"use client"

import { useState, useEffect } from "react"
import { BorderDisplay } from "@/components/ui/border-display"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2 } from "lucide-react"
import { SocialCommentSection } from "./social-comment-section"
import { toast } from "sonner"

interface SocialPost {
  id: string
  content: string
  author_id: string
  author_name: string
  author_avatar?: string
  author_border?: any
  media_urls?: string[]
  likes: number
  comments: number
  shares: number
  is_deleted: boolean
  created_at: string
  updated_at: string
}

interface SocialPostCardProps {
  post: SocialPost
  onUpdate: (postId: string, updates: Partial<SocialPost>) => void
  onDelete: (postId: string) => void
  currentUserId?: string
}

export function SocialPostCard({ post, onUpdate, onDelete, currentUserId }: SocialPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)
  const [commentsCount, setCommentsCount] = useState(post.comments)
  const [isLiking, setIsLiking] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Check if current user liked this post
    if (currentUserId) {
      checkLikeStatus()
    }
  }, [currentUserId, post.id])

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/social/posts/${post.id}/like`)
      const data = await response.json()
      if (data.success) {
        setIsLiked(data.data.liked)
      }
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const handleLike = async () => {
    if (!currentUserId || isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch(`/api/social/posts/${post.id}/like`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        const newLikedStatus = data.data.liked
        setIsLiked(newLikedStatus)
        setLikesCount(prev => newLikedStatus ? prev + 1 : prev - 1)

        onUpdate(post.id, {
          likes: newLikedStatus ? likesCount + 1 : likesCount - 1
        })
      } else {
        toast.error("Gagal menyukai postingan")
      }
    } catch (error) {
      console.error('Error liking post:', error)
      toast.error("Terjadi kesalahan saat menyukai postingan")
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async () => {
    if (!currentUserId || isSharing) return

    setIsSharing(true)
    try {
      const response = await fetch(`/api/social/posts/${post.id}/share`, {
        method: 'POST'
      })
      const data = await response.json()

      if (data.success) {
        toast.success("Postingan berhasil dibagikan!")
        onUpdate(post.id, {
          shares: post.shares + 1
        })

        // Copy link to clipboard
        const shareUrl = `${window.location.origin}/social/post/${post.id}`
        await navigator.clipboard.writeText(shareUrl)
        toast.info("Link postingan disalin ke clipboard!")
      } else {
        toast.error("Gagal membagikan postingan")
      }
    } catch (error) {
      console.error('Error sharing post:', error)
      toast.error("Terjadi kesalahan saat membagikan postingan")
    } finally {
      setIsSharing(false)
    }
  }

  const handleDelete = async () => {
    if (!currentUserId || isDeleting) return

    if (!confirm("Apakah Anda yakin ingin menghapus postingan ini?")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/social/posts?id=${post.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        onDelete(post.id)
      } else {
        toast.error(data.error || "Gagal menghapus postingan")
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error("Terjadi kesalahan saat menghapus postingan")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return `${diffMins} menit yang lalu`
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`
    } else {
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} hari yang lalu`
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom duration-300">
      <CardContent className="p-6">
        {/* Author Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <BorderDisplay
              border={post.author_border ? JSON.parse(post.author_border) : null}
              userAvatar={post.author_avatar}
              userName={post.author_name}
              size="social"
              showUserInfo={true}
              showBadge={false}
              orientation="horizontal"
              className="flex-1"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {/* Delete button for post author */}
            {currentUserId === post.author_id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:bg-red-50 hover:text-red-600 rounded-full p-2"
              >
                {isDeleting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 rounded-full p-2"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Post Time */}
        <div className="text-xs text-muted-foreground mb-4">
          {formatDate(post.created_at)}
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-foreground whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mb-4">
            {post.media_urls.length === 1 && (
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={post.media_urls[0]}
                  alt="Post media"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}
            {post.media_urls.length === 2 && (
              <div className="grid grid-cols-2 gap-2">
                {post.media_urls.map((url, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border">
                    <img
                      src={url}
                      alt={`Post media ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {post.media_urls.length > 2 && (
              <div className="grid grid-cols-2 gap-2">
                {post.media_urls.slice(0, 3).map((url, index) => (
                  <div key={index} className={`rounded-lg overflow-hidden border relative ${index === 2 && post.media_urls.length > 3 ? 'col-span-2' : ''}`}>
                    <img
                      src={url}
                      alt={`Post media ${index + 1}`}
                      className={`w-full object-cover ${index === 2 && post.media_urls.length > 3 ? 'h-48' : 'h-48'}`}
                    />
                    {index === 2 && post.media_urls.length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          +{post.media_urls.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Engagement Bar */}
        <div className="flex items-center justify-between py-3 border-t border-b">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!currentUserId || isLiking}
              className={`hover:bg-gray-100 transition-colors ${isLiked ? 'text-red-600 hover:text-red-700' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </Button>

            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="hover:bg-gray-100 text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{commentsCount}</span>
            </Button>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={!currentUserId || isSharing}
              className="hover:bg-gray-100 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-sm">{post.shares}</span>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            {post.shares > 0 && `${post.shares} bagian`}
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t">
            <SocialCommentSection
              postId={post.id}
              onCommentCountChange={(count) => {
                setCommentsCount(count)
                onUpdate(post.id, { comments: count })
              }}
              currentUserId={currentUserId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}