"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Bold, Italic, Link2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { richTextToHtml } from "@/lib/utils/rich-text"
import { htmlToRichText } from "@/lib/utils/html-to-rich-text"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

/**
 * Ô soạn thảo WYSIWYG nhỏ gọn: gõ tới đâu thấy đậm/nghiêng/link tới đó,
 * nhưng vẫn lưu xuống DB dưới dạng text thuần (**đậm**, *nghiêng*, [tên](url))
 * nên không có HTML của người dùng nào được lưu hay render lại.
 */
export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder,
  className,
  minHeight = "16rem",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  // Giá trị mà chính ô soạn thảo vừa phát ra - dùng để không nạp lại innerHTML
  // sau mỗi phím gõ (nạp lại sẽ làm con trỏ nhảy về đầu).
  const emittedRef = useRef<string | null>(null)
  const savedRange = useRef<Range | null>(null)

  const [marks, setMarks] = useState({ bold: false, italic: false })
  const [linkUrl, setLinkUrl] = useState<string | null>(null)

  // Nạp nội dung vào ô soạn thảo khi mở form / đổi tin đang sửa
  useEffect(() => {
    const el = editorRef.current
    if (!el || value === emittedRef.current) return
    el.innerHTML = value ? richTextToHtml(value) : ""
    emittedRef.current = value
  }, [value])

  const emit = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const markup = htmlToRichText(el)
    emittedRef.current = markup
    onChange(markup)
  }, [onChange])

  const syncMarks = useCallback(() => {
    if (typeof document === "undefined") return
    setMarks({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
    })
  }, [])

  const exec = (command: string, arg?: string) => {
    editorRef.current?.focus()
    document.execCommand("styleWithCSS", false, "false")
    document.execCommand(command, false, arg)
    emit()
    syncMarks()
  }

  // Dán từ Word/web: chỉ lấy text, bỏ toàn bộ định dạng rác
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")
    document.execCommand("insertText", false, text)
    emit()
  }

  const openLinkInput = () => {
    const selection = window.getSelection()
    savedRange.current =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0).cloneRange() : null
    setLinkUrl("https://")
  }

  const applyLink = () => {
    const el = editorRef.current
    const url = (linkUrl || "").trim()
    if (!el || !url || url === "https://") {
      setLinkUrl(null)
      return
    }

    el.focus()
    const selection = window.getSelection()
    if (selection && savedRange.current) {
      selection.removeAllRanges()
      selection.addRange(savedRange.current)
    }

    // Chưa bôi đen chữ nào -> chèn chính URL vào rồi biến nó thành link
    if (selection && selection.isCollapsed) {
      document.execCommand("insertText", false, url)
      const range = selection.getRangeAt(0)
      const node = range.startContainer
      const end = range.startOffset
      const linkRange = document.createRange()
      linkRange.setStart(node, Math.max(0, end - url.length))
      linkRange.setEnd(node, end)
      selection.removeAllRanges()
      selection.addRange(linkRange)
    }

    document.execCommand("createLink", false, url)
    selection?.collapseToEnd()
    emit()
    setLinkUrl(null)
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <div className="flex items-center gap-0.5 border-b px-1 py-1">
        <Button
          type="button"
          variant={marks.bold ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          title="In đậm (Ctrl+B)"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={marks.italic ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          title="In nghiêng (Ctrl+I)"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Chèn liên kết"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkInput}
        >
          <Link2 className="h-4 w-4" />
        </Button>
      </div>

      {linkUrl !== null && (
        <div className="flex items-center gap-1.5 border-b bg-muted/40 px-2 py-1.5">
          <Input
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                applyLink()
              } else if (e.key === "Escape") {
                e.preventDefault()
                setLinkUrl(null)
              }
            }}
            placeholder="https://..."
            className="h-8 text-sm"
          />
          <Button type="button" size="icon" className="h-8 w-8 shrink-0" onClick={applyLink}>
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setLinkUrl(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div
        id={id}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        style={{ minHeight }}
        onInput={emit}
        onBlur={emit}
        onPaste={handlePaste}
        onKeyUp={syncMarks}
        onMouseUp={syncMarks}
        onFocus={syncMarks}
        className={cn(
          "w-full overflow-y-auto px-3 py-2 text-sm leading-relaxed outline-none",
          "[&_a]:font-medium [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2",
          "empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        )}
      />

      <p className="border-t px-3 py-1.5 text-xs text-muted-foreground">
        Bôi đen chữ rồi bấm <strong>B</strong> / <em>I</em> (hoặc Ctrl+B / Ctrl+I). Dán link vào là
        nhân viên bấm mở được luôn.
      </p>
    </div>
  )
}
