"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface Border {
  id: string
  name: string
  image: string
  unlocked: boolean
  rarity?: "common" | "rare" | "epic" | "legendary"
}

interface BorderPreviewProps {
  border: Border
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  showLabel?: boolean
  showLockStatus?: boolean
  showRarity?: boolean
  avatarSrc?: string
  avatarName?: string
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

const sizeConfig = {
  xs: { container: "w-6 h-6", avatar: "w-4 h-4", inset: "inset-1" },
  sm: { container: "w-8 h-8", avatar: "w-5 h-5", inset: "inset-1.5" },
  md: { container: "w-10 h-10", avatar: "w-6 h-6", inset: "inset-2" },
  lg: { container: "w-12 h-12", avatar: "w-8 h-8", inset: "inset-2" },
  xl: { container: "w-14 h-14", avatar: "w-9 h-9", inset: "inset-2.5" },
  "2xl": { container: "w-18 h-18", avatar: "w-11 h-11", inset: "inset-3.5" }
}

const rarityColors = {
  common: "border-gray-400",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400"
}

const rarityBgColors = {
  common: "bg-gray-100",
  rare: "bg-blue-100",
  epic: "bg-purple-100",
  legendary: "bg-yellow-100"
}

export function BorderPreview({
  border,
  size = "md",
  showLabel = true,
  showLockStatus = true,
  showRarity = false,
  avatarSrc,
  avatarName = "U",
  isSelected = false,
  onClick,
  className = ""
}: BorderPreviewProps) {
  const config = sizeConfig[size]

  const getUserInitials = () => {
    return avatarName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  }

  const getRarityColor = () => {
    if (!border.rarity) return ""
    return rarityColors[border.rarity]
  }

  const getRarityBgColor = () => {
    if (!border.rarity) return ""
    return rarityBgColors[border.rarity]
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Border Container */}
      <div className={`relative ${config.container} ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''} ${getRarityColor()} overflow-visible`}>
        {/* Border Image */}
        <img
          src={border.image}
          alt={`${border.name} border`}
          className={`absolute inset-0 w-full h-full z-0 ${getRarityColor()} ${showRarity && border.rarity ? `border-2 ${getRarityColor()}` : ''} overflow-visible`}
          style={{
            objectFit: 'contain',
            overflow: 'visible'
          }}
          onError={(e) => {
            // Fallback to colored border if image fails to load
            e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
              <svg width="${size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 80 : 96}"
                   height="${size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 80 : 96}"
                   xmlns="http://www.w3.org/2000/svg">
                <circle cx="${size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : size === 'xl' ? 40 : 48}"
                        cy="${size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : size === 'xl' ? 40 : 48}"
                        r="${size === 'xs' ? 10 : size === 'sm' ? 14 : size === 'md' ? 20 : size === 'lg' ? 28 : size === 'xl' ? 36 : 44}"
                        fill="none"
                        stroke="${border.unlocked ? '#9ca3af' : '#d1d5db'}"
                        stroke-width="${size === 'xs' ? 1 : size === 'sm' ? 1 : size === 'md' ? 2 : size === 'lg' ? 2 : size === 'xl' ? 3 : 3}"/>
                <text x="${size === 'xs' ? 12 : size === 'sm' ? 16 : size === 'md' ? 24 : size === 'lg' ? 32 : size === 'xl' ? 40 : 48}"
                      y="${size === 'xs' ? 16 : size === 'sm' ? 20 : size === 'md' ? 28 : size === 'lg' ? 36 : size === 'xl' ? 44 : 52}"
                      text-anchor="middle"
                      fill="${border.unlocked ? '#6b7280' : '#9ca3af'}"
                      font-size="${size === 'xs' ? 4 : size === 'sm' ? 5 : size === 'md' ? 6 : size === 'lg' ? 8 : size === 'xl' ? 10 : 12}">${border.name.charAt(0)}</text>
              </svg>
            `)}`
          }}
        />

        {/* Avatar */}
        <div className={`absolute ${config.inset} flex items-center justify-center`}>
          <Avatar className={`${config.avatar} relative z-10 ${getRarityBgColor()}`}>
            <AvatarImage
              src={avatarSrc || ""}
              alt={avatarName || ""}
              className="object-cover"
            />
            <AvatarFallback className={`text-xs font-medium ${size === 'xs' ? 'text-[8px]' : size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-base'}`}>
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Lock Overlay */}
        {!border.unlocked && showLockStatus && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-20">
            <Star className={`${size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : size === 'w-6 h-6'} text-yellow-400`} />
          </div>
        )}

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center z-30">
            <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
          </div>
        )}
      </div>

      {/* Label */}
      {showLabel && (
        <div className="mt-1 text-center">
          <p className={`font-medium ${size === 'xs' ? 'text-[8px]' : size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-base'}`}>
            {border.name}
          </p>
          {!border.unlocked && showLockStatus && (
            <p className={`text-muted-foreground ${size === 'xs' ? 'text-[6px]' : size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-sm'}`}>
              🔒 Terkunci
            </p>
          )}
          {showRarity && border.rarity && (
            <Badge variant="outline" className={`text-[8px] h-4 mt-1 ${getRarityColor()}`}>
              {border.rarity}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}