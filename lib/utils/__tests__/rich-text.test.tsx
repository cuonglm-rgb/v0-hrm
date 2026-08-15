import { describe, it, expect } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { RichText, stripRichText } from "@/lib/utils/rich-text"

const render = (text: string) => renderToStaticMarkup(<RichText text={text} />)

describe("RichText", () => {
  it("in đậm bằng **", () => {
    expect(render("Xin chào **cả nhà** nhé")).toContain("<strong>cả nhà</strong>")
  })

  it("in nghiêng bằng * và _", () => {
    expect(render("chú ý *quan trọng*")).toContain("<em>quan trọng</em>")
    expect(render("chú ý _quan trọng_")).toContain("<em>quan trọng</em>")
  })

  it("đậm lồng nghiêng", () => {
    expect(render("**đậm và *nghiêng* luôn**")).toContain(
      "<strong>đậm và <em>nghiêng</em> luôn</strong>"
    )
  })

  it("** được ưu tiên hơn *", () => {
    const html = render("**abc**")
    expect(html).toContain("<strong>abc</strong>")
    expect(html).not.toContain("<em>")
  })

  it("link trần thành thẻ a mở tab mới", () => {
    const html = render("Xem tại https://pamoteam.com/tin nhé")
    expect(html).toContain('href="https://pamoteam.com/tin"')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it("link bắt đầu bằng www được thêm https://", () => {
    expect(render("vào www.pamoteam.com đi")).toContain('href="https://www.pamoteam.com"')
  })

  it("dấu câu cuối câu không bị nuốt vào link", () => {
    const html = render("Xem tại https://pamoteam.com.")
    expect(html).toContain('href="https://pamoteam.com"')
    expect(html).toContain(".</div>")
  })

  it("link có tên hiển thị", () => {
    const html = render("[Nội quy công ty](https://pamoteam.com/noi-quy)")
    expect(html).toContain('href="https://pamoteam.com/noi-quy"')
    expect(html).toContain(">Nội quy công ty</a>")
  })

  it("không cho chèn HTML thô", () => {
    const html = render('<script>alert("x")</script>')
    expect(html).not.toContain("<script>")
    expect(html).toContain("&lt;script&gt;")
  })

  it("gạch dưới trong URL không biến thành in nghiêng", () => {
    const html = render("https://pamoteam.com/a_b_c")
    expect(html).not.toContain("<em>")
    expect(html).toContain('href="https://pamoteam.com/a_b_c"')
  })

  it("giữ nguyên xuống dòng", () => {
    expect(render("dòng 1\ndòng 2")).toContain("whitespace-pre-wrap")
  })
})

describe("stripRichText", () => {
  it("bỏ hết ký hiệu định dạng", () => {
    expect(stripRichText("**đậm** và *nghiêng* và _nghiêng_")).toBe("đậm và nghiêng và nghiêng")
  })

  it("link có tên chỉ còn lại tên", () => {
    expect(stripRichText("Xem [nội quy](https://pamoteam.com/noi-quy) nhé")).toBe(
      "Xem nội quy nhé"
    )
  })

  it("link trần giữ nguyên", () => {
    expect(stripRichText("Xem https://pamoteam.com")).toBe("Xem https://pamoteam.com")
  })
})
