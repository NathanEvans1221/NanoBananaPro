# 復刻規劃提示詞：Nano Banana Pro (HTML/JS 版)

> **文件狀態：規劃與示例，不是目前程式的功能規格。** 本文描述一份假想的 React/TypeScript 原始專案及其移植方向；`constants.ts`、`types.ts`、`geminiService.ts` 等來源檔並不存在於此 repo。實際功能與執行方式請以 [README.md](README.md)、[index.html](index.html) 及根目錄的 JavaScript 模組為準。本文的步驟和程式片段不是已完成項目或即時 API 驗證證據。

## 1. 復刻規劃背景 (Project Overview)
**原始設想名稱**：Nano Banana Pro 提示詞工坊 (Prompt Workshop) v2.6；此版本描述不代表目前頁面版本。
**原始設想用途**：將簡單描述轉成影像生成提示詞，並依藝術類別套用指令。本文提及的「後端 AI Agent」只是原始構想；目前 repo 是瀏覽器端靜態網頁，直接呼叫 Gemini API，沒有後端服務。
**假設的來源技術堆疊**：React、TypeScript、Tailwind CSS、Google GenAI SDK；這些 React/TypeScript 原始碼不在目前 repo。
**本文提出的移植方向**：Vanilla HTML5、JavaScript、Tailwind CSS CDN。repo 已採用單頁 HTML 加 JavaScript 模組的做法；目前功能請查 README。

---

## 2. 復刻實作構想 (Implementation Guide for AI Agent)

以下段落是供重新實作時參考的規劃，並非目前程式的檔案清單或待辦狀態。

### 2.1. 檔案結構 (File Structure)
建議採用簡單結構或單一檔案解決方案以利攜帶。
- `index.html`：主要結構。
- `styles.css`：自定義樣式（如果主要依賴 Tailwind 則可省略）。
- `app.js`：應用程式邏輯。
- `config.js`：常數設定與提示詞模板。

### 2.2. 相依套件 (Dependencies)
- **Tailwind CSS**：使用 CDN 進行樣式設定。 `<script src="https://cdn.tailwindcss.com"></script>`
- **Google GenAI SDK**：透過 ESM import 或 CDN 使用瀏覽器相容版本。
  ```html
  <script type="importmap">
    {
      "imports": {
        "@google/genai": "https://esm.run/@google/genai"
      }
    }
  </script>
  ```
- **圖標 (Icons)**：FontAwesome 或 Heroicons SVG 字串（內嵌）。

### 2.3. 核心功能邏輯移植 (Core Functional Logic to Port)

#### A. 資料模型 (Data Models) - 來自 `constants.ts` & `types.ts`
必須複製 `CATEGORIES` 陣列。每個類別物件包含：
- `id`：列舉值 (Enum，例如 MANGA, LINE_STICKER 等)。
- `label`：顯示名稱。
- `baseSystemPrompt`：給 AI 的基礎系統指令。

#### B. 狀態管理 (State Management)
在原生 JS 中，維護一個全域 `state` 物件：
```javascript
const state = {
  theme: 'dark', // 'dark' (深色) 或 'light' (淺色)
  selectedCategoryId: 'MANGA',
  inputs: {
    userText: '',
    uploadedFiles: [] // 陣列結構：{ name, type, data(base64) }
  },
  options: {
    mangaLayout: 'SINGLE',
    mangaStyle: 'JAPANESE',
    // ... 所有其他的特定選項 (adMode, posterType 等)
    aspectRatio: '1:1'
  },
  apiKey: '' // 安全儲存或提示使用者輸入
};
```

#### C. 提示詞生成邏輯 (Prompt Generation Logic) - 關鍵！
必須從 `geminiService.ts` 移植 `enhancePrompt` 函式。這是應用程式的核心大腦。
**邏輯流程 (Logic Flow)：**
1.  **檢查類別 (Check Category)**：決定執行哪個邏輯區塊（漫畫、貼圖、廣告等）。
2.  **建構佈局指令 (Build `layoutInstruction`)**：基於子選項（例如：若 `mangaLayout === 'FOUR_PANEL'`，則注入關於四格漫畫結構的特定文字）。
3.  **建構風格變體指令 (Build `styleVariationInstruction`)**：基於風格選項（例如：若 `cinematicStyle === 'CYBERPUNK'`，則注入如 "Neon" (霓虹), "High tech" (高科技) 等關鍵字）。
4.  **組合系統指令 (Construct `systemInstruction`)**：結合 `baseSystemPrompt` + `layoutInstruction` + `styleVariationInstruction`。
5.  **API 呼叫 (API Call)**：將此 `systemInstruction` + 使用者輸入傳送給 `gemini-2.5-flash` 模型。

#### D. 圖片生成邏輯 (Image Generation Logic)
從 `geminiService.ts` 移植 `generateImageFromPrompt`。
-   **模型 (Model)**：`gemini-3-pro-image-preview`（或同等的可用模型）。
-   **輸入 (Input)**：來自「強化提示詞 (Enhance Prompt)」步驟的*結果*。
-   **設定 (Config)**：傳入長寬比 `aspectRatio`。

### 2.4. UI 設計與佈局 (UI Design & Layout - Tailwind)

**主題配色 (Theme Colors)**：
-   **深色模式 (Dark Mode)**：`bg-slate-900`, `text-slate-100`, 卡片：`bg-slate-800/50`。
-   **淺色模式 (Light Mode)**：`bg-gray-50`, `text-gray-900`, 卡片：`bg-white`。
-   **強調色 (Accent)**：靛藍色 (`text-indigo-500`, `border-indigo-500`)。

**佈局區塊 (Layout Sections)**：
1.  **頁首 (Header)**：標題、版本、作者、主題切換、API Key 按鈕。
2.  **主網格 (Main Grid)**：
    -   **左側欄 (控制項 Controls)**：
        -   **類別網格 (Category Grid)**：2 欄式可點擊卡片。
        -   **選項面板 (Options Panel)**：動態區塊，*僅*渲染所選類別的特定按鈕（例如：當選擇漫畫時，只顯示「漫畫風格」）。使用 `hidden` 類別或直接 DOM 操作來切換這些面板。
        -   **長寬比 (Aspect Ratio)**：一列長寬比按鈕 (1:1, 3:4, 16:9 等)。
    -   **右側欄 (輸入與輸出 Input & Output)**：
        -   **輸入區 (Input Area)**：帶有字數統計的大型文字輸入框。
        -   **上傳區 (Upload Area)**：拖放區或檔案輸入。
        -   **動作按鈕 (Action Buttons)**：「✨ 強化提示詞 (Enhance Prompt)」（主要），「🎨 生成圖片 (Generate Image)」（次要）。
        -   **輸出區 (Output Area)**：顯示生成的文字提示詞（可複製）與生成的圖片結果。

---

## 3. 詳細邏輯規則 (Detailed Logic Rules - 秘訣所在)

### 3.1. 漫畫模式邏輯 (Manga Mode Logic)
-   **版面 (Layouts)**：單幅、四格、六格、封面。
-   **風格 (Styles)**：日式、美式、韓式條漫、像素藝術。
-   **限制 (Constraint)**：如果選擇「LINE 貼圖 (Line Sticker)」，強制執行「無白邊 (No White Border)」規則。

### 3.2. 電影級 3D 邏輯 (Cinematic 3D Logic)
-   **關鍵 (Critical)**：必須排除衝突的關鍵字。（例如：如果選擇 "Disney" (迪士尼)，嚴格禁止使用 "Photorealistic" (寫實照片) 詞彙）。

### 3.3. 語言處理 (Language Handling)
-   使用者輸入可能是簡單的中/英文。
-   **系統指令 (System Prompt)** 強制 AI 以「專家能力」思考，但「輸出最終提示詞為繁體中文」（或英文，視偏好而定，但程式碼中指定為 `繁體中文`）。
-   **重要 (Important)**：圖片內的文字（漫畫/貼圖中使用的對話框）必須在提示詞中指定為繁體中文。

---

## 4. Agent 實作步驟計畫 (Step-by-Step Implementation Plan for the Agent)

1.  **設置 (Setup)**：建立 `index.html`，引入 Tailwind CDN 並建立基本佈局骨架。
2.  **資料移植 (Data Porting)**：將分析中的 `CATEGORIES` 陣列複製到 JS 變數中。
3.  **UI 元件 (UI Components)**：撰寫渲染函式 `renderCategories()` 和 `renderOptionControls()`，根據 `state` 更新 DOM。
4.  **互動 (Interaction)**：添加事件監聽器以更新 `state` 並重新渲染特定的選項面板。
5.  **服務層 (Service Layer)**：在 JS 中實作 `GeminiService` 類別/模組。
    -   `enhancePrompt(userInput, state)` -> 回傳字串 (String)。
    -   `generateImage(prompt, state)` -> 回傳圖片 URL/Base64。
6.  **整合 (Integration)**：連接「強化 (Enhance)」按鈕以執行服務並顯示載入狀態/結果。

---

## 5. 模擬元件程式碼 (Mock Component Code - HTML/JS 範例)

```html
<!-- Category Card Example (類別卡片範例) -->
<div onclick="selectCategory('MANGA')" class="cursor-pointer p-4 rounded-xl border transition-all ${state.selected === 'MANGA' ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 bg-slate-800'}">
  <div class="text-3xl mb-2">✒️</div>
  <div class="font-bold">日系漫畫</div>
  <div class="text-xs text-gray-400">分鏡、黑白/全彩切換</div>
</div>
```

```javascript
// Service Logic Port Example (服務邏輯移植範例)
async function enhancePrompt(userInput) {
  // 1. 取得目前類別設定 (Get current category config)
  const cat = CATEGORIES.find(c => c.id === state.selectedCategoryId);
  
  // 2. 基於 state.options 建構指令 (Build instructions based on state.options)
  let layoutInstruction = "";
  if (state.selectedCategoryId === 'MANGA' && state.options.mangaLayout === 'FOUR_PANEL') {
     layoutInstruction = "Special layout: 4-panel manga (Yon-koma)...";
  }
  
  // 3. 建構負載 (Construct payload)
  const finalPrompt = `${cat.baseSystemPrompt}\n${layoutInstruction}\nUser Input: ${userInput}`;
  
  // 4. 呼叫 GenAI (Call GenAI)
  // ...
}
```
