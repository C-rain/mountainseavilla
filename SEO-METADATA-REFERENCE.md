# SEO Metadata Reference

更新日期：2026-05-13

這份檔案作為靜態網站的 metadata 參考表。未來新增頁面或調整頁面主題時，請先更新這裡，再同步修改對應 HTML `<head>`。

| Page | Canonical | Title Focus | OG / Twitter Image |
| --- | --- | --- | --- |
| `index.html` | `https://mountainseavilla.com/` | 西莒山海一家會館 / 青帆村海景民宿 | `banner-1.jpg` |
| `rooms.html` | `https://mountainseavilla.com/rooms.html` | 房型介紹 / 海景、山景與背包客房 | `room-sea-new.jpg` |
| `booking.html` | `https://mountainseavilla.com/booking.html` | 訂房方式 / 匯款與入住資訊 | `banner-2.jpg` |
| `access.html` | `https://mountainseavilla.com/access.html` | 交通方式 / 南竿到西莒與接送 | `scenery-2.jpg` |
| `faq.html` | `https://mountainseavilla.com/faq.html` | 常見問題 / 住宿 FAQ | `scenery-5.jpg` |
| `gallery.html` | `https://mountainseavilla.com/gallery.html` | 山海影像 / 房型與周邊景色 | `banner-1.jpg` |
| `xiju-travel.html` | `https://mountainseavilla.com/xiju-travel.html` | 西莒旅行 / 景點與住宿建議 | `scenery-6.jpg` |

維護規則：

- 每頁 `title` 與 `description` 必須對應單一搜尋意圖，不重複覆蓋其他頁。
- `canonical` 一律使用正式網址，不使用 `index.html` 版本首頁。
- `og:image` 與 `twitter:image` 盡量共用同一張主圖，並補齊對應 alt 描述。
- 若頁面主題改動，請同步檢查 sitemap、內部連結與 JSON-LD 是否仍一致。
