import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  createSocialPost,
  getSocialPosts,
  getSocialPostById,
  deleteSocialPost
} from '@/lib/social-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const author_id = searchParams.get('author_id') || undefined

    const posts = await getSocialPosts({ limit, offset, author_id })

    return NextResponse.json({
      success: true,
      data: posts
    })
  } catch (error) {
    console.error('Error fetching social posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, media_urls } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    // Get user info for the post
    const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${session.user.id}`)
    const userData = await userResponse.json()

    if (!userData.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to get user information' },
        { status: 500 }
      )
    }

    const user = userData.data
    const postId = await createSocialPost({
      content: content.trim(),
      author_id: session.user.id,
      author_name: user.name || session.user.name || 'Unknown',
      author_avatar: user.profilePhoto || user.avatar,
      author_border: JSON.stringify(user.border || null),
      media_urls
    })

    // Get the created post
    const post = await getSocialPostById(postId)

    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Error creating social post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const success = await deleteSocialPost(postId, session.user.id)

    return NextResponse.json({
      success,
      message: success ? 'Post deleted successfully' : 'Failed to delete post or unauthorized'
    })
  } catch (error) {
    console.error('Error deleting social post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}