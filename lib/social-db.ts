import mysql from 'mysql2/promise'

interface SocialPost {
  id: string
  content: string
  author_id: string
  author_name: string
  author_avatar?: string
  author_border?: string
  media_urls?: string[]
  likes: number
  comments: number
  shares: number
  is_deleted: boolean
  created_at: string
  updated_at: string
}

interface SocialComment {
  id: string
  post_id: string
  parent_id?: string
  content: string
  author_id: string
  author_name: string
  author_avatar?: string
  author_border?: string
  likes: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  replies?: SocialComment[]
}

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hikaricha_db'
}

export async function createSocialPost(data: {
  content: string
  author_id: string
  author_name: string
  author_avatar?: string
  author_border?: string
  media_urls?: string[]
}): Promise<string> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    const postId = `social_post_${Date.now()}`

    await connection.execute(`
      INSERT INTO social_posts (
        id, content, author_id, author_name, author_avatar, author_border,
        media_urls, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      postId,
      data.content,
      data.author_id,
      data.author_name,
      data.author_avatar,
      data.author_border,
      data.media_urls ? JSON.stringify(data.media_urls) : null
    ])

    return postId
  } finally {
    await connection.end()
  }
}

export async function getSocialPosts(options: {
  limit?: number
  offset?: number
  author_id?: string
  includeDeleted?: boolean
} = {}): Promise<SocialPost[]> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    let query = `
      SELECT * FROM social_posts
      WHERE 1=1
    `

    const params: any[] = []

    if (options.author_id) {
      query += ' AND author_id = ?'
      params.push(options.author_id)
    }

    if (!options.includeDeleted) {
      query += ' AND is_deleted = FALSE'
    }

    query += ' ORDER BY created_at DESC'

    if (options.limit) {
      query += ' LIMIT ?'
      params.push(options.limit)

      if (options.offset) {
        query += ' OFFSET ?'
        params.push(options.offset)
      }
    }

    const [rows] = await connection.execute(query, params)

    const posts = rows as any[]

    return posts.map(post => ({
      id: post.id,
      content: post.content,
      author_id: post.author_id,
      author_name: post.author_name,
      author_avatar: post.author_avatar,
      author_border: post.author_border,
      media_urls: post.media_urls ? JSON.parse(post.media_urls) : undefined,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      is_deleted: Boolean(post.is_deleted),
      created_at: post.created_at,
      updated_at: post.updated_at
    }))
  } finally {
    await connection.end()
  }
}

export async function getSocialPostById(id: string): Promise<SocialPost | null> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM social_posts WHERE id = ? AND is_deleted = FALSE',
      [id]
    )

    const posts = rows as any[]

    if (posts.length === 0) {
      return null
    }

    const post = posts[0]

    return {
      id: post.id,
      content: post.content,
      author_id: post.author_id,
      author_name: post.author_name,
      author_avatar: post.author_avatar,
      author_border: post.author_border,
      media_urls: post.media_urls ? JSON.parse(post.media_urls) : undefined,
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      is_deleted: Boolean(post.is_deleted),
      created_at: post.created_at,
      updated_at: post.updated_at
    }
  } finally {
    await connection.end()
  }
}

export async function deleteSocialPost(id: string, author_id: string): Promise<boolean> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    const [result] = await connection.execute(
      'UPDATE social_posts SET is_deleted = TRUE, updated_at = NOW() WHERE id = ? AND author_id = ?',
      [id, author_id]
    )

    return (result as any).affectedRows > 0
  } finally {
    await connection.end()
  }
}

export async function createSocialComment(data: {
  post_id: string
  parent_id?: string
  content: string
  author_id: string
  author_name: string
  author_avatar?: string
  author_border?: string
}): Promise<string> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    const commentId = `social_comment_${Date.now()}`

    await connection.execute(`
      INSERT INTO social_comments (
        id, post_id, parent_id, content, author_id, author_name, author_avatar, author_border,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      commentId,
      data.post_id,
      data.parent_id,
      data.content,
      data.author_id,
      data.author_name,
      data.author_avatar,
      data.author_border
    ])

    // Update post comment count
    await connection.execute(
      'UPDATE social_posts SET comments = comments + 1 WHERE id = ?',
      [data.post_id]
    )

    return commentId
  } finally {
    await connection.end()
  }
}

export async function getSocialComments(postId: string): Promise<SocialComment[]> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    const [rows] = await connection.execute(`
      SELECT * FROM social_comments
      WHERE post_id = ? AND is_deleted = FALSE
      ORDER BY created_at ASC
    `, [postId])

    const comments = rows as any[]

    // Build nested structure
    const topLevelComments: SocialComment[] = []
    const commentMap = new Map<string, SocialComment>()

    // First pass: create all comments and build map
    comments.forEach(comment => {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
        media_urls: comment.media_urls ? JSON.parse(comment.media_urls) : undefined
      })
    })

    // Second pass: build hierarchy
    comments.forEach(comment => {
      const commentWithChildren = commentMap.get(comment.id)!

      if (comment.parent_id && commentMap.has(comment.parent_id)) {
        const parent = commentMap.get(comment.parent_id)!
        parent.replies!.push(commentWithChildren)
      } else {
        topLevelComments.push(commentWithChildren)
      }
    })

    return topLevelComments
  } finally {
    await connection.end()
  }
}

export async function likeSocialPost(userId: string, postId: string): Promise<boolean> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    await connection.query('START TRANSACTION')

    try {
      // Check if already liked
      const [existing] = await connection.execute(
        'SELECT id FROM social_likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
        [userId, postId, 'post']
      )

      const isLiked = (existing as any[]).length > 0

      if (isLiked) {
        // Unlike
        await connection.execute(
          'DELETE FROM social_likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
          [userId, postId, 'post']
        )

        // Decrement like count
        await connection.execute(
          'UPDATE social_posts SET likes = likes - 1 WHERE id = ?',
          [postId]
        )
      } else {
        // Like
        await connection.execute(
          'INSERT INTO social_likes (user_id, target_id, target_type) VALUES (?, ?, ?)',
          [userId, postId, 'post']
        )

        // Increment like count
        await connection.execute(
          'UPDATE social_posts SET likes = likes + 1 WHERE id = ?',
          [postId]
        )
      }

      await connection.query('COMMIT')

      return !isLiked // Return new like status (true = liked, false = unliked)
    } catch (error) {
      await connection.query('ROLLBACK')
      throw error
    }
  } finally {
    await connection.end()
  }
}

export async function isSocialPostLiked(userId: string, postId: string): Promise<boolean> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    const [rows] = await connection.execute(
      'SELECT id FROM social_likes WHERE user_id = ? AND target_id = ? AND target_type = ?',
      [userId, postId, 'post']
    )

    return (rows as any[]).length > 0
  } finally {
    await connection.end()
  }
}

export async function shareSocialPost(userId: string, postId: string): Promise<boolean> {
  const connection = await mysql.createConnection(dbConfig)

  try {
    await connection.execute(
      'UPDATE social_posts SET shares = shares + 1 WHERE id = ?',
      [postId]
    )

    // Track share in analytics (optional)
    await connection.execute(
      'INSERT INTO social_shares (user_id, post_id, created_at) VALUES (?, ?, NOW())',
      [userId, postId]
    )

    return true
  } finally {
    await connection.end()
  }
}