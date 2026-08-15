import type { ReactNode } from "react"

// =============================================
// RICH TEXT (markup rút gọn cho nội dung tin tức)
// =============================================
// Định dạng lưu trong DB vẫn là text thuần:
//   **đậm**                     -> <strong>
//   *nghiêng* hoặc _nghiêng_    -> <em>
//   https://... hoặc www...     -> tự động thành link bấm được
//   [Tên hiển thị](https://...) -> link có tên
//
// Nội dung được parse thành token rồi mới dựng ra React element / HTML với
// text đã escape, KHÔNG nhét HTML thô của người dùng vào trang, nên người
// soạn tin không thể chèn <script>.

const AUTO_LINK = /(?:https?:\/\/|www\.)[^\s<>"'`]+/
const MD_LINK = /\[([^\]\n]*)\]\(\s*((?:https?:\/\/|www\.)[^\s)]+)\s*\)/
const BOLD = /\*\*([^\n]+?)\*\*/
const ITALIC_STAR = /\*([^*\n]+?)\*/
const ITALIC_UNDERSCORE = /_([^_\n]+?)_/

// Dấu câu dính cuối link khi gõ "xem tại https://a.com." -> không tính vào URL
const TRAILING_PUNCTUATION = /[.,;:!?)\]}>]+$/

export type RichToken =
  | { type: "text"; value: string }
  | { type: "bold"; children: RichToken[] }
  | { type: "italic"; children: RichToken[] }
  | { type: "link"; href: string; label: string }

export function toHref(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

interface Hit {
  index: number
  length: number
  token: RichToken
}

function findFirst(text: string): Hit | null {
  let best: Hit | null = null
  const consider = (hit: Hit) => {
    if (best === null || hit.index < best.index) best = hit
  }

  // 1. Link có tên: [Tên](url)
  const mdLink = MD_LINK.exec(text)
  if (mdLink) {
    consider({
      index: mdLink.index,
      length: mdLink[0].length,
      token: { type: "link", href: mdLink[2], label: mdLink[1] || mdLink[2] },
    })
  }

  // 2. Link trần trong nội dung
  const autoLink = AUTO_LINK.exec(text)
  if (autoLink) {
    const raw = autoLink[0].replace(TRAILING_PUNCTUATION, "")
    if (raw.length > 0) {
      consider({
        index: autoLink.index,
        length: raw.length,
        token: { type: "link", href: raw, label: raw },
      })
    }
  }

  // 3. **đậm** (phải xét trước *nghiêng*)
  const bold = BOLD.exec(text)
  if (bold) {
    consider({
      index: bold.index,
      length: bold[0].length,
      token: { type: "bold", children: parseRichText(bold[1]) },
    })
  }

  // 4. *nghiêng* / _nghiêng_
  for (const re of [ITALIC_STAR, ITALIC_UNDERSCORE]) {
    const italic = re.exec(text)
    if (italic) {
      consider({
        index: italic.index,
        length: italic[0].length,
        token: { type: "italic", children: parseRichText(italic[1]) },
      })
    }
  }

  return best
}

export function parseRichText(text: string): RichToken[] {
  const out: RichToken[] = []
  let rest = text

  while (rest.length > 0) {
    const hit = findFirst(rest)
    if (!hit) {
      out.push({ type: "text", value: rest })
      break
    }
    if (hit.index > 0) out.push({ type: "text", value: rest.slice(0, hit.index) })
    out.push(hit.token)
    rest = rest.slice(hit.index + hit.length)
  }

  return out
}

function renderTokens(tokens: RichToken[], keyPrefix: string): ReactNode[] {
  return tokens.map((token, i) => {
    const key = `${keyPrefix}-${i}`
    switch (token.type) {
      case "text":
        return token.value
      case "bold":
        return <strong key={key}>{renderTokens(token.children, key)}</strong>
      case "italic":
        return <em key={key}>{renderTokens(token.children, key)}</em>
      case "link":
        return (
          <a
            key={key}
            href={toHref(token.href)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline underline-offset-2 break-all hover:text-blue-700"
          >
            {token.label}
          </a>
        )
    }
  })
}

/**
 * Render nội dung có định dạng. Xuống dòng giữ nguyên bằng whitespace-pre-wrap.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={`whitespace-pre-wrap ${className || ""}`}>
      {renderTokens(parseRichText(text), "rt")}
    </div>
  )
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function tokensToHtml(tokens: RichToken[]): string {
  return tokens
    .map((token) => {
      switch (token.type) {
        case "text":
          return escapeHtml(token.value).replace(/\n/g, "<br>")
        case "bold":
          return `<b>${tokensToHtml(token.children)}</b>`
        case "italic":
          return `<i>${tokensToHtml(token.children)}</i>`
        case "link":
          return `<a href="${escapeHtml(toHref(token.href))}">${escapeHtml(token.label)}</a>`
      }
    })
    .join("")
}

/**
 * Đổi markup sang HTML để nạp vào ô soạn thảo WYSIWYG.
 * Mọi text đều được escape trước khi ghép thẻ.
 */
export function richTextToHtml(text: string): string {
  return tokensToHtml(parseRichText(text))
}

/**
 * Bỏ hết ký hiệu định dạng, trả về text thuần - dùng cho đoạn tóm tắt / preview
 * (nơi không render được thẻ <a>, ví dụ bên trong <button>).
 */
export function stripRichText(text: string): string {
  return text
    .replace(/\[([^\]\n]*)\]\(\s*(?:https?:\/\/|www\.)[^\s)]+\s*\)/g, "$1")
    .replace(/\*\*([^\n]+?)\*\*/g, "$1")
    .replace(/\*([^*\n]+?)\*/g, "$1")
    .replace(/_([^_\n]+?)_/g, "$1")
}
