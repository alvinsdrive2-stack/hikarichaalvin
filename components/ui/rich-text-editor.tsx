"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { Button } from "./button"
import { Badge } from "./badge"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Eye,
  Edit3,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon
} from "lucide-react"

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-md" />
})

import "react-quill/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  showPreview?: boolean
  mode?: "edit" | "preview" | "both"
  onModeChange?: (mode: "edit" | "preview") => void
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten Anda...",
  height = 200,
  showPreview = false,
  mode = "edit",
  onModeChange
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Custom Quill modules and toolbar
      const modules = {
        toolbar: {
          container: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ],
          handlers: {
            image: imageHandler,
            link: linkHandler
          }
        },
        clipboard: {
          matchVisual: false,
        }
      }

      // Custom formats for matcha-specific content
      const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'script', 'align', 'direction',
        'size', 'color', 'background',
        'link', 'image', 'video', 'code-block', 'formula'
      ]

      // Image handler that supports file upload
      function imageHandler() {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
          const file = input.files?.[0]
          if (file) {
            const formData = new FormData()
            formData.append('image', file)

            try {
              const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData
              })

              if (response.ok) {
                const data = await response.json()
                const range = quillRef.current?.getEditor().getSelection()
                quillRef.current?.getEditor().insertEmbed(
                  range?.index || 0,
                  'image',
                  data.url
                )
              } else {
                // Fallback to base64 if upload fails
                const reader = new FileReader()
                reader.onload = (e) => {
                  const range = quillRef.current?.getEditor().getSelection()
                  quillRef.current?.getEditor().insertEmbed(
                    range?.index || 0,
                    'image',
                    e.target?.result
                  )
                }
                reader.readAsDataURL(file)
              }
            } catch (error) {
              console.error('Image upload failed:', error)
              // Fallback to base64
              const reader = new FileReader()
              reader.onload = (e) => {
                const range = quillRef.current?.getEditor().getSelection()
                quillRef.current?.getEditor().insertEmbed(
                  range?.index || 0,
                  'image',
                  e.target?.result
                )
              }
              reader.readAsDataURL(file)
            }
          }
        }
      }

      // Link handler with validation
      function linkHandler() {
        const range = quillRef.current?.getEditor().getSelection()
        const url = prompt('Masukkan URL:')

        if (url) {
          // Validate URL
          try {
            new URL(url)
            quillRef.current?.getEditor().formatText(
              range?.index || 0,
              range?.length || 0,
              'link',
              url
            )
          } catch {
            alert('URL tidak valid')
          }
        }
      }
    }
  }, [])

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: false,
    }
  }

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'script', 'align', 'direction',
    'size', 'color', 'background',
    'link', 'image', 'video', 'code-block', 'formula'
  ]

  const renderPreview = () => {
    return (
      <div
        className="prose prose-sm max-w-none p-4 border rounded-md min-h-[200px] bg-white"
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }

  const renderEditor = () => {
    return (
      <div className="border rounded-md overflow-hidden">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          style={{ height: `${height}px` }}
          className="bg-white"
        />
        <div className="h-12" /> // Spacer for toolbar
      </div>
    )
  }

  const getWordCount = () => {
    const temp = document.createElement('div')
    temp.innerHTML = value
    return temp.innerText.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharacterCount = () => {
    const temp = document.createElement('div')
    temp.innerHTML = value
    return temp.innerText.length
  }

  if (mode === "preview") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Preview Mode
          </Badge>
          {onModeChange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeChange("edit")}
              className="text-xs"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
        {renderPreview()}
      </div>
    )
  }

  if (mode === "edit") {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Edit3 className="h-3 w-3 mr-1" />
              Edit Mode
            </Badge>
            <div className="text-xs text-muted-foreground">
              {getWordCount()} kata • {getCharacterCount()} karakter
            </div>
          </div>
          {showPreview && onModeChange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeChange("preview")}
              className="text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
          )}
        </div>
        {renderEditor()}
      </div>
    )
  }

  // Both mode (side by side)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">
            <Edit3 className="h-3 w-3 mr-1" />
            Edit Mode
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Preview Mode
          </Badge>
          <div className="text-xs text-muted-foreground">
            {getWordCount()} kata • {getCharacterCount()} karakter
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Editor</h4>
          {renderEditor()}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Preview</h4>
          {renderPreview()}
        </div>
      </div>
    </div>
  )
}

// Quick format buttons for simpler use cases
export function QuickFormatButtons({ onFormat }: { onFormat: (format: string) => void }) {
  return (
    <div className="flex items-center gap-1 p-2 border rounded-md bg-gray-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('bold')}
        className="h-8 w-8 p-0"
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('italic')}
        className="h-8 w-8 p-0"
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('underline')}
        className="h-8 w-8 p-0"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('list')}
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('ordered')}
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('quote')}
        className="h-8 w-8 p-0"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('code')}
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('link')}
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onFormat('image')}
        className="h-8 w-8 p-0"
      >
        <Image className="h-4 w-4" />
      </Button>
    </div>
  )
}