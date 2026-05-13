# 山海一家會館 SEO / AI 搜尋 / 追蹤改版文件

更新日期：2026-05-13

> 備註：本次環境沒有安裝 `seo-audit`、`ai-seo`、`programmatic-seo`、`schema-markup`、`site-architecture`、`analytics-tracking` 這幾個指定 skill，因此以下以同等檢查流程直接產出可執行版本。因未提供獨立文章原文，AI 搜尋改寫先以首頁與既有網站內容作為來源。

## 1. SEO Audit 結論

目前網站已具備上線基礎：自訂網域、HTTPS、sitemap、robots、canonical、OG metadata、favicon、GA4、首頁 `WebSite` / `LodgingBusiness` 結構化資料、FAQPage、多頁 SEO 架構都已存在。

優先修正項目：

1. 已補：每頁加入 `WebPage` 或對應頁面類型，非首頁補 `BreadcrumbList`，讓 Google 與 AI 搜尋更清楚理解頁面層級。
2. 已補：GA4 事件追蹤，包含電話、Line、Facebook、Google 地圖、訂房意圖、房型篩選、估價與圖庫開啟。
3. 待補：各房型與景點頁面目前資訊仍偏簡短，若要吃更多長尾搜尋，需要擴成獨立頁或程式化頁。
4. 待補：Google 商家評論、真實住客問答、季節活動實況不能憑空生成，需由館方提供或從可驗證來源整理。
5. 待補：交通船班、藍眼淚、方塊海、燕鷗季等時效資訊，需要建立更新責任與日期標示，避免 AI 引用過期內容。

## 2. AI SEO 文章改寫版本

建議頁面定位：`西莒山海一家會館住宿指南`

建議標題：

西莒山海一家會館住宿指南：房型、交通、訂房與青帆村旅遊資訊

建議摘要：

西莒山海一家會館位於連江縣莒光鄉青帆村 96-3 號，是一間可眺望青帆港、聚落與海景的馬祖西莒民宿。會館提供雙人海景房、雙人山景房、四人山景房與背包客房，適合雙人旅行、家庭住宿、跳島旅客與攝影旅人。旅客通常先抵達南竿，再由福澳港搭船前往西莒青帆港；入住前可提前告知船班，安排碼頭接送。

可被 AI 直接引用的段落：

山海一家會館位於馬祖西莒青帆村高點，地址為連江縣莒光鄉青帆村 96-3 號。住宿房型包含海景雙人房、山景雙人房、山景四人房與背包客房，並提供早餐、碼頭接送與租機車洽詢服務。因鄰近青帆港、坤坵沙灘、菜浦澳與方塊海，適合作為西莒住宿與藍眼淚季節旅遊據點。

AI 問答格式：

Q：山海一家會館在哪裡？

A：山海一家會館位於連江縣莒光鄉青帆村 96-3 號，位置在西莒青帆村高點，可眺望港口、聚落與海景。

Q：山海一家會館有哪些房型？

A：目前網站列出的房型包含雙人海景房、雙人山景房、四人山景房與背包客房。雙人海景房 NT$2,600 起，雙人山景房 NT$2,200 起，四人山景房 NT$4,000 起，背包客房 NT$800，實際房況與價格仍需向館方確認。

Q：從南竿怎麼去山海一家會館？

A：旅客通常從南竿福澳港搭乘交通船前往西莒青帆港。抵達青帆港後，可提前提供船班資訊，洽詢山海一家會館碼頭接送。

Q：山海一家會館適合看藍眼淚嗎？

A：山海一家會館位於西莒，周邊可安排菜浦澳、坤坵沙灘等季節性藍眼淚路線。藍眼淚能否看見受季節、天候、潮汐、風向與光害影響，出發前建議向館方或官方旅遊資訊確認。

## 3. Programmatic SEO 架構

不要一次產生大量薄頁。建議先建立資料模型，等每個頁面都有足夠真實內容後再擴張。

核心資料表：

| 資料集 | 欄位 | 用途 |
| --- | --- | --- |
| `rooms` | slug, 房型名, 人數, 床型, 價格, 衛浴, 景觀, 照片, 適合對象, FAQ | 產生房型頁 |
| `attractions` | slug, 景點名, 距離, 適合季節, 交通方式, 停留時間, 注意事項, 圖片 | 產生景點與行程頁 |
| `seasonal_topics` | slug, 主題, 月份, 可見機率說明, 注意事項, 官方來源 | 產生藍眼淚、燕鷗、方塊海頁 |
| `travel_routes` | slug, 出發地, 抵達地, 船班摘要, 接送說明, 來源更新日 | 產生交通頁 |
| `search_intents` | keyword, intent, target_url, page_type, priority | 管理長尾關鍵字 |

第一階段 URL：

- `/rooms/sea-view/`：西莒海景雙人房
- `/rooms/mountain-view/`：西莒山景雙人房
- `/rooms/family/`：西莒四人房
- `/rooms/backpacker/`：西莒背包客住宿
- `/travel/blue-tears/`：西莒藍眼淚住宿與路線
- `/travel/square-sea/`：西莒方塊海時間與住宿
- `/access/nangan-to-xiju/`：南竿到西莒交通
- `/itineraries/xiju-2-days/`：西莒兩天一夜住宿行程

每頁最低內容門檻：

- 1 段 80-120 字摘要
- 3-5 個實用小節
- 1 組 FAQ
- 至少 1 張真實照片
- 明確更新日期
- 內部連結到訂房、房型、交通與相關景點

## 4. Schema Markup 規劃

已存在：

- `WebSite`
- `LodgingBusiness`
- `FAQPage`
- favicon / manifest / OG metadata

本次已補：

- 首頁：`WebPage`
- 房型頁：`CollectionPage` + `ItemList` + `BreadcrumbList`
- 訂房頁：`WebPage` + `BreadcrumbList`
- 交通頁：`WebPage` + `BreadcrumbList`
- 西莒旅遊頁：`WebPage` + `BreadcrumbList`
- 圖庫頁：`ImageGallery` + `BreadcrumbList`
- FAQ 頁：`BreadcrumbList`

下一階段建議補：

- 房型獨立頁：`HotelRoom` 或 `Accommodation`
- 景點頁：`TouristAttraction`
- 行程頁：`TouristTrip`
- 圖片：`ImageObject`
- 訂房步驟：`HowTo`，但需確認流程穩定後再補
- 評論：`Review` / `AggregateRating`，只能用真實、可驗證評論，不可自編

## 5. Site Architecture 建議

目前層級：

- 首頁 `/`
- 房型 `/rooms.html`
- 訂房 `/booking.html`
- 交通 `/access.html`
- 西莒旅行 `/xiju-travel.html`
- FAQ `/faq.html`
- 山海影像 `/gallery.html`

建議擴張層級：

- `/rooms/`
  - `/rooms/sea-view/`
  - `/rooms/mountain-view/`
  - `/rooms/family/`
  - `/rooms/backpacker/`
- `/travel/`
  - `/travel/blue-tears/`
  - `/travel/square-sea/`
  - `/travel/qingfan-village/`
  - `/travel/kunku-beach/`
- `/access/`
  - `/access/nangan-to-xiju/`
  - `/access/qingfan-harbor-pickup/`
- `/itineraries/`
  - `/itineraries/xiju-2-days/`
  - `/itineraries/matsu-xiju-dongju/`
- `/faq/`
  - `/faq/booking/`
  - `/faq/transport/`
  - `/faq/seasonal-viewing/`

內部連結規則：

- 每個景點頁都要回連「訂房方式」與「房型資訊」。
- 每個房型頁都要連到「交通位置」與「西莒旅行」。
- FAQ 答案中出現房型、交通、藍眼淚、方塊海時，要連到對應頁。

## 6. GA4 與轉換追蹤事件

本次已加入事件：

| 事件 | 觸發時機 | 用途 |
| --- | --- | --- |
| `contact_click` | 點電話、Line、Facebook、地圖 | 看使用者偏好的聯絡方式 |
| `generate_lead` | 點電話或 Line | 可在 GA4 設為主要轉換 |
| `booking_intent` | 點訂房頁或訂房區塊連結 | 看訂房意圖 |
| `room_filter` | 使用房型篩選 | 看熱門房型 |
| `room_estimate_update` | 更新房價估算 | 看估價需求 |
| `gallery_open` | 開啟圖片燈箱 | 看照片互動 |

GA4 建議設定為 Key Event：

- `generate_lead`
- `booking_intent`
- `contact_click`，條件為 `contact_method = phone` 或 `line`

建議 GA4 自訂維度：

- `contact_method`
- `filter_type`
- `room_price`
- `nights`
- `guests`

## 7. 還需要提供的資料

請優先補這些，會直接影響 SEO 和 AI 搜尋可信度：

1. Google 商家正式名稱、Google Business Profile 管理後台網址或 Place ID。
2. 真實評論內容：評論文字、星等、日期、是否允許放在官網。
3. 每個房型的完整資訊：坪數、床型、可住人數、是否可加床、是否有陽台、是否海景、平假日價格。
4. 每間房至少 3-5 張照片，並標註房型與照片內容。
5. 最新交通船班來源、更新頻率、遇天候取消時的處理方式。
6. 藍眼淚、方塊海、燕鷗、星沙等季節活動的館方實際安排方式。
7. 是否提供晚餐、早餐固定內容、餐點價格、需提前幾天預約。
8. 租機車服務：價格、是否代訂、是否需要駕照、油資與保險說明。
9. 入住規則：入住退房時間、取消政策、寵物、禁菸、付款方式。
10. 你最想主打的搜尋詞排序，例如「西莒住宿」、「馬祖民宿」、「西莒海景民宿」、「藍眼淚住宿」。
