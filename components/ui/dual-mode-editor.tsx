"use client"

import { useState, useEffect } from "react"
import { Button } from "./button"
import { Badge } from "./badge"
import { Card, CardContent, CardHeader } from "./card"
import { RichTextEditor } from "./rich-text-editor"
import { SimpleTextEditor } from "./simple-text-editor"
import {
  Bold,
  Image,
  MessageSquare,
  FileText,
  Sparkles,
  Zap
} from "lucide-react"

interface DualModeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  mode?: "rich" | "simple" | "choice"
  onModeChange?: (mode: "rich" | "simple") => void
  showModeToggle?: boolean
  simpleModeProps?: {
    images?: string[]
    onImageUpload?: (images: string[]) => void
  }
  disabled?: boolean
}

export function DualModeEditor({
  value,
  onChange,
  placeholder = "Tulis konten Anda...",
  height = 200,
  mode: propMode = "choice",
  onModeChange,
  showModeToggle = true,
  simpleModeProps = {},
  disabled = false
}: DualModeEditorProps) {
  const [internalMode, setInternalMode] = useState<"rich" | "simple">("simple")
  const [mode, setMode] = useState<"rich" | "simple" | "choice">(propMode)

  // Update mode when propMode changes
  useEffect(() => {
    setMode(propMode)
  }, [propMode])

  const isModeChoice = mode === "choice"
  const currentMode = isModeChoice ? internalMode : mode

  const handleModeSelect = (selectedMode: "rich" | "simple") => {
    if (isModeChoice) {
      setInternalMode(selectedMode)
    } else {
      setMode(selectedMode)
    }
    onModeChange?.(selectedMode)
  }

  // Convert simple content to HTML for storage
  const handleSimpleChange = (text: string) => {
    const { images = [] } = simpleModeProps

    // Basic WhatsApp-style formatting
    let formattedText = text
    formattedText = formattedText.replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
    formattedText = formattedText.replace(/_([^_]+)_/g, '<em>$1</em>')
    formattedText = formattedText.replace(/~([^~]+)~/g, '<s>$1</s>')
    formattedText = formattedText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded text-sm">$1</code>')

    // Convert line breaks
    formattedText = formattedText.replace(/\n/g, '<br>')

    // Add images at the beginning
    let finalContent = formattedText
    if (images.length > 0) {
      const imageHtml = images.map(img =>
        `<img src="${img}" alt="Shared image" class="max-w-full rounded-lg shadow-sm my-2" />`
      ).join('')
      finalContent = imageHtml + '<br>' + formattedText
    }

    onChange(finalContent)
  }

  // Extract text from HTML for simple mode
  const extractTextFromHtml = (html: string): string => {
    const temp = document.createElement('div')
    temp.innerHTML = html

    // Remove images for text extraction
    const images = temp.querySelectorAll('img')
    images.forEach(img => img.remove())

    // Convert <br> back to newlines
    const text = temp.innerText || temp.textContent || ""
    return text.replace(/<br>/g, '\n')
  }

  // Extract images from HTML
  const extractImagesFromHtml = (html: string): string[] => {
    const temp = document.createElement('div')
    temp.innerHTML = html
    const images = Array.from(temp.querySelectorAll('img'))
    return images.map(img => img.src || img.getAttribute('src') || '')
  }

  // Mode choice screen
  if (isModeChoice) {
    return (
      <Card>
        <CardHeader>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Pilih Mode Editor</h3>
            <p className="text-sm text-muted-foreground">
              Pilih editor yang sesuai dengan kebutuhan Anda
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rich Text Mode */}
            <Button
              variant="outline"
              className="h-auto p-6 flex-col items-start space-y-3 hover:border-primary"
              onClick={() => handleModeSelect("rich")}
            >
              <div className="flex items-center gap-2 w-full">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="font-semibold">Rich Text Mode</span>
                <Badge variant="secondary" className="ml-auto">Professional</Badge>
              </div>
              <div className="text-sm text-left space-y-1">
                <div className="flex items-center gap-2">
                  <Bold className="h-3 w-3" />
                  <span>Formatting lengkap</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image className="h-3 w-3" />
                  <span>Upload images</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  <span>Preview mode</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Untuk tutorial, review, dan konten profesional
              </p>
            </Button>

            {/* Simple Mode */}
            <Button
              variant="outline"
              className="h-auto p-6 flex-col items-start space-y-3 hover:border-green-600"
              onClick={() => handleModeSelect("simple")}
            >
              <div className="flex items-center gap-2 w-full">
                <MessageSquare className="h-6 w-6 text-green-600" />
                <span className="font-semibold">Simple Mode</span>
                <Badge variant="secondary" className="ml-auto">WhatsApp Style</Badge>
              </div>
              <div className="text-sm text-left space-y-1">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  <span>Cepat & praktis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image className="h-3 w-3" />
                  <span>Upload foto</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bold className="h-3 w-3" />
                  <span>Basic formatting</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                Untuk chat, Q&A, dan diskusi cepat
              </p>
            </Button>
          </div>

          {/* Sample Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="font-medium mb-2 text-blue-800">Rich Text Example:</div>
              <div className="space-y-1 text-blue-700">
                <div>📝 <strong>Panduan Lengkap</strong></div>
                <div>• Step 1: Persiapan</div>
                <div>• Step 2: Proses</div>
                <div>📷 [Image Preview]</div>
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium mb-2 text-green-800">Simple Mode Example:</div>
              <div className="space-y-1 text-green-700">
                <div>*Panduan singkat*</div>
                <div>Step 1: Persiapan</div>
                <div>Step 2: Proses</div>
                <div>[📷 Foto terlampir]</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Rich Text Editor
  if (currentMode === "rich") {
    return (
      <div className="space-y-3">
        {showModeToggle && (
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              <FileText className="h-3 w-3 mr-1" />
              Rich Text Mode
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleModeSelect("simple")}
              className="text-xs"
            >
              Switch to Simple
            </Button>
          </div>
        )}
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          height={height}
          mode="edit"
          showPreview={false}
        />
      </div>
    )
  }

  // Simple Text Editor
  return (
    <div className="space-y-3">
      {showModeToggle && (
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Simple Mode (WhatsApp Style)
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleModeSelect("rich")}
            className="text-xs"
          >
            Switch to Rich Text
          </Button>
        </div>
      )}
      <SimpleTextEditor
        value={extractTextFromHtml(value)}
        onChange={handleSimpleChange}
        placeholder={placeholder}
        onImageUpload={(newImages) => {
          const existingImages = extractImagesFromHtml(value)
          const allImages = [...existingImages, ...newImages]
          const currentText = extractTextFromHtml(value)
          handleSimpleChange(currentText)
        }}
        showSubmitButton={false}
        maxLength={2000}
      />
    </div>
  )
}

// Helper function to render content based on mode
export function renderContent(content: string, mode: "rich" | "simple" = "rich") {
  if (mode === "simple") {
    // For simple mode, just render HTML with basic styling
    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  // For rich mode, render with full styling
  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}