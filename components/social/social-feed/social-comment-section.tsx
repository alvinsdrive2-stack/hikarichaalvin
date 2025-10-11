"use client"

import { useState, useEffect, useRef } from "react"
import { BorderDisplay } from "@/components/ui/border-display"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Send } from "lucide-react"
import { toast } from "sonner"

interface SocialComment {
  id: string
  post_id: string
  parent_id?: string
  content: string
  author_id: string
  author_name: string
  author_avatar?: string
  author_border?: any
  likes: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  replies?: SocialComment[]
}

interface SocialCommentSectionProps {
  postId: string
  onCommentCountChange: (count: number) => void
  currentUserId?: string
}

export function SocialCommentSection({ postId, onCommentCountChange, currentUserId }: SocialCommentSectionProps) {
  const [comments, setComments] = useState<SocialComment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`)
      const data = await response.json()

      if (data.success) {
        setComments(data.data)
        onCommentCountChange(data.data.length)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async () => {
    if (!currentUserId || !commentText.trim() || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: commentText.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setCommentText("")
        setComments(data.data)
        onCommentCountChange(data.data.length)
        toast.success("Komentar berhasil ditambahkan!")
      } else {
        toast.error("Gagal menambahkan komentar")
      }
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error("Terjadi kesalahan saat menambahkan komentar")
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplySubmit = async (parentCommentId: string) => {
    if (!currentUserId || !replyText.trim() || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/social/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyText.trim(),
          parent_id: parentCommentId
        })
      })

      const data = await response.json()

      if (data.success) {
        setReplyText("")
        setReplyingTo(null)
        setComments(data.data)
        onCommentCountChange(data.data.length)
        toast.success("Balasan berhasil ditambahkan!")
      } else {
        toast.error("Gagal menambahkan balasan")
      }
    } catch (error) {
      console.error('Error adding reply:', error)
      toast.error("Terjadi kesalahan saat menambahkan balasan")
    } finally {
      setSubmitting(false)
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

  const CommentItem = ({ comment, isReply = false }: { comment: SocialComment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex gap-3">
        <BorderDisplay
          border={comment.author_border ? JSON.parse(comment.author_border) : null}
          userAvatar={comment.author_avatar}
          userName={comment.author_name}
          size="comment"
          showUserInfo={false}
          showBadge={false}
          orientation="horizontal"
          className="flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm">{comment.author_name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 ml-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
            >
              <Heart className="h-3 w-3 mr-1" />
              {comment.likes}
            </Button>

            {!isReply && currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-muted-foreground hover:text-foreground h-6 px-2"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Balas
              </Button>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan..."
                className="min-h-[80px] resize-none text-sm"
                maxLength={500}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyText("")
                  }}
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleReplySubmit(comment.id)}
                  disabled={!replyText.trim() || submitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {submitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Send className="h-3 w-3 mr-1" />
                  )}
                  Balas
                </Button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="bg-gray-100 rounded-lg p-3 h-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Comment Form */}
      {currentUserId && (
        <div className="space-y-3">
          <Textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tambahkan komentar..."
            className="min-h-[80px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {commentText.length}/500
            </span>
            <Button
              onClick={handleCommentSubmit}
              disabled={!commentText.trim() || submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Komentar
            </Button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Belum ada komentar</p>
          <p className="text-xs">Jadilah yang pertama berkomentar!</p>
        </div>
      )}

      {/* Login Prompt */}
      {!currentUserId && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <p>Login untuk dapat berkomentar</p>
        </div>
      )}
    </div>
  )
}