# NanoBananaPro
Nano Banana Pro 提示詞工程神器。專為高品質影像生成設計。

![NanoBananaPro](./images/NanoBananaPro.png)

[Demo 網站](https://nano-banana-pro-pink.vercel.app/)

使用提示詞強化與圖片生成需要 Gemini API Key；模型權限、配額與費用依 Google 帳戶設定而異。

[AI Studio](https://ai.studio/)

## 本機執行

此專案是靜態網頁，使用 JavaScript ES Modules。請從專案根目錄啟動任一靜態 HTTP 伺服器，再用瀏覽器開啟該網址；直接以 `file://` 開啟可能會被瀏覽器阻擋模組載入。若已安裝 Python，可執行 `python -m http.server 8000`，再前往 `http://localhost:8000`。不需要安裝 npm 套件。

Tailwind CSS、Font Awesome 與 Google GenAI SDK 由 CDN 載入，因此頁面需要網路連線。提示詞強化使用 `gemini-2.5-flash`；圖片生成使用 `gemini-3-pro-image-preview`，需有該模型的 API 存取權。

## API Key 使用方式

輸入的 API Key 預設只保留在目前頁面。勾選「在此瀏覽器保存金鑰」後，才會存入瀏覽器 `localStorage`；取消勾選或按「清除金鑰」可移除保存的 Key。頁面中的 JavaScript 可讀取瀏覽器端 Key，因此請勿在共用或不受信任的裝置保存，也不要將此純前端頁面當成公開服務的金鑰保護方式。

## 可調整的提示詞選項

- 日系漫畫：單幅、四格、六格或封面；日系、美式、韓漫或像素畫風；黑白或全彩。
- LINE 貼圖：單張或八張套組。
- 商業廣告：展示台、手模或模特兒情境。
- 3D 電影級：極致寫實、迪士尼、皮克斯或賽博龐克。
- 文案小幫手：社群貼文或廣告文案，以及專業、親切或幽默語氣。

其餘類別可透過描述欄提供需求，並可選擇構圖比例；目前沒有額外的類別子選項。

## 附件與已知限制

- 支援 PNG、JPG、WebP、PDF 與 TXT；最多 5 個附件，單檔最多 10 MB，附件總計最多 12 MB。
- 這是純前端工具，沒有後端或帳戶系統。除非明確勾選保存，API Key 只留在目前頁面；瀏覽器端程式碼仍可讀取 Key，不應把它當成公開服務的金鑰保護方式。
- Gemini API 請求會使用使用者自己的 Key，模型存取、配額與費用由其 Google 帳戶決定。
- 執行 Node.js 回歸測試：`node --test`。

## 範例輸出

以下圖片是專案保存的示例，不代表已用目前版本即時呼叫 Gemini API 驗證圖片生成流程。
![photo_2025-12-10_18-46-55.jpg](./images/photo_2025-12-10_18-46-55.jpg)

---

![photo_2025-12-10_18-46-43.jpg](./images/photo_2025-12-10_18-46-43.jpg)

---

![photo_2025-12-10_18-46-49.jpg](./images/photo_2025-12-10_18-46-49.jpg)

---

