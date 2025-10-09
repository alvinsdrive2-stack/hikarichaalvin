import { NextRequest, NextResponse } from 'next/server'
import { getThreadReplies, createReply } from '@/lib/forum-db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const replies = await getThreadReplies(params.id)

    return NextResponse.json({
      success: true,
      data: replies
    })
  } catch (error) {
    console.error('Get replies error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch replies' },
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

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { content, parent_id } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    const replyId = await createReply({
      thread_id: params.id,
      parent_id: parent_id && parent_id.trim() && parent_id !== params.id ? parent_id.trim() : null,
      content: content.trim(),
      author_id: session.user.id || session.user.email!
    })

    return NextResponse.json({
      success: true,
      data: { replyId }
    })
  } catch (error) {
    console.error('Create reply error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create reply' },
      { status: 500 }
    )
  }
}