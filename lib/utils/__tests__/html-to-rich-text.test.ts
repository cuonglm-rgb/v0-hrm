// @vitest-environment happy-dom
import { describe, it, expect } from "vitest"
import { htmlToRichText } from "@/lib/utils/html-to-rich-text"
import { richTextToHtml, stripRichText } from "@/lib/utils/rich-text"

const fromHtml = (html: string) => {
  const root = document.createElement("div")
  root.innerHTML = html
  return htmlToRichText(root)
}

describe("htmlToRichText", () => {
  it("đọc được thẻ b/strong và i/em", () => {
    expect(fromHtml("Xin chào <b>cả nhà</b>")).toBe("Xin chào **cả nhà**")
    expect(fromHtml("Xin chào <strong>cả nhà</strong>")).toBe("Xin chào **cả nhà**")
    expect(fromHtml("chú ý <i>gấp</i>")).toBe("chú ý *gấp*")
    expect(fromHtml("chú ý <em>gấp</em>")).toBe("chú ý *gấp*")
  })

  it("đọc được span style do trình duyệt sinh ra", () => {
    expect(fromHtml('<span style="font-weight: bold">đậm</span>')).toBe("**đậm**")
    expect(fromHtml('<span style="font-style: italic">nghiêng</span>')).toBe("*nghiêng*")
  })

  it("khoảng trắng nằm ngoài cặp ký hiệu", () => {
    expect(fromHtml("a<b> đậm </b>b")).toBe("a **đậm** b")
  })

  it("thẻ b rỗng bị bỏ qua", () => {
    expect(fromHtml("a<b></b>b")).toBe("ab")
  })

  it("xuống dòng bằng br và div", () => {
    expect(fromHtml("dòng 1<br>dòng 2")).toBe("dòng 1\ndòng 2")
    expect(fromHtml("dòng 1<div>dòng 2</div>")).toBe("dòng 1\ndòng 2")
    expect(fromHtml("<div>dòng 1</div><div>dòng 2</div>")).toBe("dòng 1\ndòng 2")
  })

  it("dòng trống giữ nguyên", () => {
    expect(fromHtml("<div>a</div><div><br></div><div>b</div>")).toBe("a\n\nb")
  })

  it("link giữ tên hiển thị", () => {
    expect(fromHtml('<a href="https://pamoteam.com/x">Nội quy</a>')).toBe(
      "[Nội quy](https://pamoteam.com/x)"
    )
  })

  it("link mà tên trùng địa chỉ thì để trần", () => {
    expect(fromHtml('<a href="https://pamoteam.com">https://pamoteam.com</a>')).toBe(
      "https://pamoteam.com"
    )
  })

  it("bỏ thẻ lạ, giữ lại chữ", () => {
    expect(fromHtml('<span class="x">a</span><font color="red">b</font>')).toBe("ab")
    expect(fromHtml("<script>alert(1)</script>an toàn")).toBe("an toàn")
  })

  it("bỏ khoảng trắng thừa cuối", () => {
    expect(fromHtml("<div>a</div><div><br></div>")).toBe("a")
  })
})

describe("đi vòng markup -> HTML -> markup không mất dữ liệu", () => {
  const cases = [
    "Xin chào **cả nhà** nhé",
    "chú ý *quan trọng* và **rất quan trọng**",
    "dòng 1\ndòng 2\n\ndòng 4",
    "Xem [Nội quy](https://pamoteam.com/noi-quy) trước nhé",
    "Link trần https://pamoteam.com/abc ở giữa câu",
    "**1. Đăng nhập toàn bộ tài khoản**\n- Hầu hết các phần mềm nội bộ\n- Microsoft Teams và Gmail",
  ]

  for (const original of cases) {
    it(JSON.stringify(original.slice(0, 40)), () => {
      const root = document.createElement("div")
      root.innerHTML = richTextToHtml(original)
      expect(htmlToRichText(root)).toBe(original)
    })
  }

  it("chữ nghiêng bằng _ được chuẩn hóa về *", () => {
    const root = document.createElement("div")
    root.innerHTML = richTextToHtml("chú ý _gấp_")
    const result = htmlToRichText(root)
    expect(result).toBe("chú ý *gấp*")
    expect(stripRichText(result)).toBe("chú ý gấp")
  })
})
