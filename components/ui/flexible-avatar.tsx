"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

interface FlexibleAvatarProps {
  src?: string
  name?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
  className?: string
  showBorder?: boolean
  borderColor?: string
}

const sizeConfig = {
  xs: { avatar: "w-6 h-6", fallback: "text-xs" },
  sm: { avatar: "w-8 h-8", fallback: "text-sm" },
  md: { avatar: "w-10 h-10", fallback: "text-base" },
  lg: { avatar: "w-12 h-12", fallback: "text-lg" },
  xl: { avatar: "w-16 h-16", fallback: "text-xl" },
  "2xl": { avatar: "w-20 h-20", fallback: "text-2xl" },
  "3xl": { avatar: "w-24 h-24", fallback: "text-3xl" },
}

export function FlexibleAvatar({
  src,
  name = "U",
  size = "md",
  className = "",
  showBorder = false,
  borderColor = "border-gray-400"
}: FlexibleAvatarProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  const config = sizeConfig[size]

  // Update src when prop changes
  useEffect(() => {
    setCurrentSrc(src)
  }, [src])

  useEffect(() => {
    // Listen for avatar updates
    const handleAvatarUpdate = (event: CustomEvent) => {
      if (event.detail.image) {
        const timestamp = Date.now()
        const separator = event.detail.image.includes('?') ? '&' : '?'
        setCurrentSrc(`${event.detail.image}${separator}t=${timestamp}`)
      }
    }

    window.addEventListener('profile-updated', handleAvatarUpdate as EventListener)

    return () => {
      window.removeEventListener('profile-updated', handleAvatarUpdate as EventListener)
    }
  }, [])

  const getUserInitials = () => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  }

  return (
    <Avatar
      className={`${config.avatar} ${showBorder ? `ring-2 ring-offset-2 ${borderColor}` : ''} ${className}`}
    >
      <AvatarImage
        src={currentSrc}
        alt={name}
        className="object-cover"
      />
      <AvatarFallback className={`font-medium ${config.fallback}`}>
        {getUserInitials()}
      </AvatarFallback>
    </Avatar>
  )
}