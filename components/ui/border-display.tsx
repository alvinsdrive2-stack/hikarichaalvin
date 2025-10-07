"use client"

import { BorderPreview } from "./border-preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Border {
  id: string
  name: string
  image: string
  unlocked: boolean
  rarity?: "common" | "rare" | "epic" | "legendary"
}

interface BorderDisplayProps {
  border: Border
  userAvatar?: string
  userName?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  showUserInfo?: boolean
  showBadge?: boolean
  badgeText?: string
  orientation?: "horizontal" | "vertical"
  className?: string
}

export function BorderDisplay({
  border,
  userAvatar,
  userName,
  size = "md",
  showUserInfo = false,
  showBadge = false,
  badgeText,
  orientation = "horizontal",
  className = ""
}: BorderDisplayProps) {
  if (orientation === "vertical") {
    return (
      <div className={`flex flex-col items-center space-y-2 ${className}`}>
        <BorderPreview
          border={border}
          size={size}
          avatarSrc={userAvatar}
          avatarName={userName}
          showLabel={false}
          showLockStatus={false}
        />
        {showUserInfo && userName && (
          <div className="text-center">
            <p className="text-sm font-medium truncate max-w-20">{userName}</p>
            {showBadge && badgeText && (
              <Badge variant="secondary" className="text-xs mt-1">
                {badgeText}
              </Badge>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <BorderPreview
        border={border}
        size={size}
        avatarSrc={userAvatar}
        avatarName={userName}
        showLabel={false}
        showLockStatus={false}
      />
      {showUserInfo && userName && (
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{userName}</p>
          {showBadge && badgeText && (
            <Badge variant="secondary" className="text-xs mt-1">
              {badgeText}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

// Compact version for dropdowns and tight spaces
export function CompactBorderDisplay({
  border,
  userAvatar,
  userName,
  size = "sm",
  className = ""
}: Pick<BorderDisplayProps, "border" | "userAvatar" | "userName" | "size" | "className">) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <BorderPreview
        border={border}
        size={size}
        avatarSrc={userAvatar}
        avatarName={userName}
        showLabel={false}
        showLockStatus={false}
      />
      <span className="text-sm font-medium truncate">{userName}</span>
    </div>
  )
}

// Minimal version for user mentions and avatars
export function MinimalBorderDisplay({
  border,
  userAvatar,
  userName,
  size = "xs",
  className = ""
}: Pick<BorderDisplayProps, "border" | "userAvatar" | "userName" | "size" | "className">) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <BorderPreview
        border={border}
        size={size}
        avatarSrc={userAvatar}
        avatarName={userName}
        showLabel={false}
        showLockStatus={false}
      />
    </span>
  )
}