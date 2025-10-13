import { NextRequest, NextResponse } from 'next/server'

// This is a simplified in-memory store for online users
// In production, you'd want to use Redis or another external store
const onlineUsers = new Map<string, {
  userId: string
  name: string
  socketId: string
  lastSeen: string
}>()

export async function GET(request: NextRequest) {
  try {
    // Clean up users who haven't been seen for more than 5 minutes
    const now = new Date()
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)

    for (const [userId, user] of onlineUsers.entries()) {
      const lastSeen = new Date(user.lastSeen)
      if (lastSeen < fiveMinutesAgo) {
        onlineUsers.delete(userId)
      }
    }

    const onlineUsersList = Array.from(onlineUsers.values()).map(user => ({
      id: user.userId,
      name: user.name,
      status: 'ONLINE',
      lastSeen: user.lastSeen
    }))

    return NextResponse.json({
      success: true,
      data: onlineUsersList,
      count: onlineUsersList.length
    })
  } catch (error) {
    console.error('Error fetching online users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch online users' },
      { status: 500 }
    )
  }
}

// This function would be called by the Socket.io server to update online status
export function addOnlineUser(userId: string, name: string, socketId: string) {
  onlineUsers.set(userId, {
    userId,
    name,
    socketId,
    lastSeen: new Date().toISOString()
  })
}

export function removeOnlineUser(userId: string) {
  onlineUsers.delete(userId)
}

export function updateLastSeen(userId: string) {
  const user = onlineUsers.get(userId)
  if (user) {
    user.lastSeen = new Date().toISOString()
  }
}