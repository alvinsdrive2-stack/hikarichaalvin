"use client"

import Link from "next/link"
import { UserProfileLink } from "./user-profile-link"

interface ContentRendererProps {
  content: string
  className?: string
}

export function ContentRenderer({ content, className = "" }: ContentRendererProps) {
  // Convert @mentions to clickable links
  const renderContentWithMentions = (text: string) => {
    // Regex to match @mentions (@username)
    const mentionRegex = /@([a-zA-Z0-9_]+)/g

    const parts = []
    let lastIndex = 0
    let match

    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before the mention
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }

      const username = match[1]
      const fullMatch = match[0]

      // Add the mention as a clickable link
      parts.push(
        <span
          key={`${match.index}-${username}`}
          className="inline-flex items-center"
        >
          <UserProfileLink
            user={{
              name: username,
              // We'll need to find the user ID, but for now use username as ID
              id: username
            }}
            size="sm"
            className="inline-flex items-center"
          />
        </span>
      )

      lastIndex = mentionRegex.lastIndex
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  // Convert line breaks to <br>
  const formatText = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, index) => (
      <div key={index} className="min-h-[1.2em]">
        {renderContentWithMentions(line)}
      </div>
    ))
  }

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {formatText(content)}
    </div>
  )
}