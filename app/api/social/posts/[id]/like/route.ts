import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { likeSocialPost, isSocialPostLiked } from '@/lib/social-db'

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

    const isLiked = await likeSocialPost(session.user.id, params.id)

    return NextResponse.json({
      success: true,
      data: { liked: isLiked }
    })
  } catch (error) {
    console.error('Error liking social post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to like post' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    const isLiked = await isSocialPostLiked(session.user.id, params.id)

    return NextResponse.json({
      success: true,
      data: { liked: isLiked }
    })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check like status' },
      { status: 500 }
    )
  }
}