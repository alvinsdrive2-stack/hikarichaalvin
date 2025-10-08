"use client"

import { BorderPreview } from "./border-preview"
import { Button } from "./button"
import { Badge } from "./badge"
import { Coins, Lock, Check, Star, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog"

interface BorderPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  border: {
    id: string
    name: string
    description?: string
    imageUrl: string
    price: number | null
    rarity: string
    unlocked: boolean
  }
  userPoints: number
  onPurchase?: (borderId: string) => void
  onSelect?: (borderId: string) => void
  userAvatar?: string
  userName?: string
}

export function BorderPreviewModal({
  isOpen,
  onClose,
  border,
  userPoints,
  onPurchase,
  onSelect,
  userAvatar = "",
  userName = ""
}: BorderPreviewModalProps) {
  if (!border) {
    return null
  }

  const canAfford = border.price ? userPoints >= border.price : true
  const isFree = !border.price || border.price === 0
  const isAchievementOnly = border.price === null

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleAction = () => {
    if (border.unlocked) {
      onSelect?.(border.id)
      onClose()
    } else if (canAfford && !isAchievementOnly) {
      onPurchase?.(border.id)
      onClose()
    }
  }

  const getActionText = () => {
    if (border.unlocked) {
      return "Pilih Border"
    } else if (isAchievementOnly) {
      return "Hanya Achievement"
    } else if (isFree) {
      return "Buka Border"
    } else if (canAfford) {
      return `Beli Border - ${border.price} Points`
    } else {
      return `Poin Tidak Cukup`
    }
  }

  const getActionDisabled = () => {
    if (border.unlocked) return false
    if (isFree) return false
    if (isAchievementOnly) return true
    return !canAfford
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Detail Border
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Border Preview */}
          <div className="flex justify-center">
            <BorderPreview
              border={border}
              size="2xl"
              avatarSrc={userAvatar}
              avatarName={userName}
              showLabel={false}
              showLockStatus={false}
            />
          </div>

          {/* Border Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-bold">{border.name}</h3>
              <Badge className={getRarityColor(border.rarity)}>
                {border.rarity}
              </Badge>
              {border.unlocked && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
            {border.description && (
              <p className="text-sm text-muted-foreground">
                {border.description}
              </p>
            )}
          </div>

          {/* Price & Status */}
          <div className="space-y-3">
            {!border.unlocked && (
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAchievementOnly ? (
                      <Star className="h-4 w-4 text-purple-500" />
                    ) : isFree ? (
                      <Star className="h-4 w-4 text-green-500" />
                    ) : (
                      <Coins className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">
                      {isAchievementOnly
                        ? "Achievement Only"
                        : isFree
                          ? "Gratis"
                          : `${border.price} Points`
                      }
                    </span>
                  </div>
                  {!isAchievementOnly && !isFree && (
                    <Badge variant={canAfford ? "secondary" : "destructive"}>
                      {canAfford ? "Bisa Dibeli" : "Poin Tidak Cukup"}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Poin Anda</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {userPoints.toLocaleString()} Points
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleAction}
            disabled={getActionDisabled()}
            className="w-full"
            variant={
              border.unlocked
                ? "default"
                : isAchievementOnly
                  ? "secondary"
                  : canAfford
                    ? "default"
                    : "secondary"
            }
          >
            <div className="flex items-center gap-2">
              {border.unlocked ? (
                <Check className="h-4 w-4" />
              ) : isAchievementOnly ? (
                <Star className="h-4 w-4" />
              ) : canAfford ? (
                <Coins className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>{getActionText()}</span>
            </div>
          </Button>

          {isAchievementOnly && !border.unlocked && (
            <p className="text-xs text-center text-purple-600 font-medium">
              Hanya dapat didapat dari achievement Bronze, Silver, dan Gold
            </p>
          )}
          {!canAfford && !isFree && !isAchievementOnly && (
            <p className="text-xs text-center text-muted-foreground">
              Butuh {border.price} points, Anda punya {userPoints} points
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}