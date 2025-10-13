import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createSocialComment, getSocialComments } from '@/lib/social-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await getSocialComments(params.id)

    return NextResponse.json({
      success: true,
      data: comments
    })
  } catch (error) {
    console.error('Error fetching social comments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, parent_id } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    // Get user info for the comment
    const userResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${session.user.id}`)
    const userData = await userResponse.json()

    if (!userData.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to get user information' },
        { status: 500 }
      )
    }

    const user = userData.data
    const commentId = await createSocialComment({
      post_id: params.id,
      parent_id,
      content: content.trim(),
      author_id: session.user.id,
      author_name: user.name || session.user.name || 'Unknown',
      author_avatar: user.profilePhoto || user.avatar,
      author_border: user.border ? JSON.stringify(user.border) : null
    })

    // Get updated comments
    const comments = await getSocialComments(params.id)

    return NextResponse.json({
      success: true,
      data: comments
    })
  } catch (error) {
    console.error('Error creating social comment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}