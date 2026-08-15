// =============================================
// HTML (từ ô soạn thảo contentEditable) -> markup rút gọn
// =============================================
// Ngược lại với richTextToHtml(). Chỉ giữ lại đậm / nghiêng / link, mọi thẻ
// khác bị bỏ, nên nội dung dán từ Word/web vào cũng ra text sạch.

const BLOCK_TAGS = new Set(["DIV", "P", "LI", "TR", "H1", "H2", "H3", "H4", "H5", "H6"])

function isBlock(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((node as HTMLElement).tagName)
}

function wrap(inner: string, marker: string): string {
  // Không bọc khi rỗng, và giữ khoảng trắng ở ngoài cặp ký hiệu để
  // "** đậm **" không làm hỏng định dạng lúc parse lại.
  const match = inner.match(/^(\s*)([\s\S]*?)(\s*)$/)
  if (!match || !match[2]) return inner
  return `${match[1]}${marker}${match[2]}${marker}${match[3]}`
}

function serializeChildren(parent: Node): string {
  let out = ""
  for (const child of Array.from(parent.childNodes)) {
    if (isBlock(child) && out && !out.endsWith("\n")) out += "\n"
    out += serializeNode(child)
  }
  return out
}

function serializeNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent || ""
  if (node.nodeType !== Node.ELEMENT_NODE) return ""

  const el = node as HTMLElement
  const tag = el.tagName

  if (tag === "BR") return "\n"
  if (tag === "SCRIPT" || tag === "STYLE") return ""

  const inner = serializeChildren(el)

  switch (tag) {
    case "B":
    case "STRONG":
      return wrap(inner, "**")
    case "I":
    case "EM":
      return wrap(inner, "*")
    case "A": {
      const href = el.getAttribute("href") || ""
      if (!href) return inner
      const label = inner.trim()
      return !label || label === href ? href : `[${label}](${href})`
    }
    default: {
      // Trình duyệt đôi khi dùng <span style="font-weight:bold"> thay cho <b>
      let result = inner
      const weight = el.style?.fontWeight
      if (weight === "bold" || weight === "bolder" || Number(weight) >= 600) {
        result = wrap(result, "**")
      }
      if (el.style?.fontStyle === "italic") {
        result = wrap(result, "*")
      }
      return BLOCK_TAGS.has(tag) && !result.endsWith("\n") ? result + "\n" : result
    }
  }
}

export function htmlToRichText(root: HTMLElement): string {
  return serializeChildren(root)
    .replace(/ /g, " ") // &nbsp; do contentEditable sinh ra
    .replace(/\n+$/, "")
}
