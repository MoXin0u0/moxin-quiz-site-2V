# 墨忻刷題網

墨忻刷題網是一個可部署於 GitHub Pages 的純前端題庫刷題平台，副標題為「支援多題庫的隨機刷題與錯題複習系統」。本系統定位為官方題庫反覆練習平台，不是 AI 自由出題平台，也不是 AI 猜題平台。

系統使用 HTML、CSS、JavaScript、JSON、localStorage 與 GitHub Actions 建置，不使用 Firebase、Supabase、MySQL、MongoDB、後端伺服器、登入系統、會員系統、React、Vue 或 Angular。

## 功能特色

- 多題庫管理
- 隨機刷題
- 錯題重做
- 錯題本複習
- 收藏題目
- 模擬考模式
- 題庫搜尋與題目篩選
- 圖片題與詳解圖片顯示
- 前端匯入 JSON 題庫
- 匯出錯題本、收藏題目、答題紀錄與本機資料備份
- GitHub Actions 自動產生 `question-banks.json`
- AI 題庫生成提示詞說明頁，但不串接任何 AI API

## 檔案結構

```text
/
├─ index.html
├─ style.css
├─ script.js
├─ question-banks.json
├─ README.md
│
├─ questions/
│   └─ sample.json
│
├─ assets/
│   └─ images/
│       └─ sample_diagram.svg
│
├─ scripts/
│   └─ build-question-index.js
│
└─ .github/
    └─ workflows/
        └─ build-question-index.yml
```

## 如何新增題庫

正式題庫建議放在 `questions/` 資料夾。例如：

```text
questions/erp-planner.json
questions/ipas-ai-basic.json
```

每個題庫 JSON 檔本身必須包含：

- `bankId`
- `title`
- `description`
- `version`
- `createdDate`
- `category`
- `questions`

新增題庫後推送到 GitHub 的 `main` 分支，GitHub Actions 會自動掃描 `questions/` 中所有 `.json` 檔案並重新產生 `question-banks.json`。因此一般情況不需要手動修改 `question-banks.json`。

## 題庫 JSON 格式

```json
{
  "bankId": "sample",
  "title": "範例題庫",
  "description": "示範墨忻刷題網支援的題型與格式",
  "version": "1.0",
  "createdDate": "2026-06-06",
  "category": "範例",
  "questions": []
}
```

## 單選題寫法

```json
{
  "id": "Q001",
  "type": "single_choice",
  "question": "下列哪一項是正確答案？",
  "options": {
    "A": "選項A",
    "B": "選項B",
    "C": "選項C",
    "D": "選項D"
  },
  "answer": "B",
  "explanation": "本題答案為 B。請說明 B 正確的原因，以及其他選項錯在哪裡。",
  "tags": ["範例"],
  "difficulty": "easy",
  "chapter": "基本概念"
}
```

## 複選題寫法

複選題必須完全選對才算答對。少選、多選、選錯都算錯。

```json
{
  "id": "Q002",
  "type": "multiple_choice",
  "question": "下列哪些選項正確？",
  "options": {
    "A": "選項A",
    "B": "選項B",
    "C": "選項C",
    "D": "選項D"
  },
  "answer": ["A", "C"],
  "explanation": "本題答案為 A、C。A 與 C 符合題意，B 與 D 不符合。",
  "tags": ["範例"],
  "difficulty": "medium",
  "chapter": "基本概念"
}
```

## 是非題寫法

```json
{
  "id": "Q003",
  "type": "true_false",
  "question": "墨忻刷題網可部署於 GitHub Pages。",
  "answer": true,
  "explanation": "本題答案為 true。本系統是純前端靜態網站，可部署於 GitHub Pages。",
  "tags": ["範例"],
  "difficulty": "easy",
  "chapter": "部署方式"
}
```

## 填空題寫法

填空題會忽略使用者輸入答案前後空白。`caseSensitive` 為 `false` 時，不分大小寫。多個可接受答案任一符合即正確。

```json
{
  "id": "Q004",
  "type": "fill_blank",
  "question": "本機資料主要儲存在瀏覽器的 ____。",
  "answer": ["localStorage", "LocalStorage"],
  "caseSensitive": false,
  "explanation": "本題答案為 localStorage。",
  "tags": ["資料儲存"],
  "difficulty": "easy",
  "chapter": "資料儲存"
}
```

## 圖片題寫法

題目圖片使用 `images` 欄位，詳解圖片使用 `explanationImages` 欄位。兩者都可以放一張或多張圖片。

```json
{
  "id": "Q005",
  "type": "single_choice",
  "question": "請根據下圖判斷，下列哪一項正確？",
  "images": [
    {
      "src": "assets/images/Q005.png",
      "alt": "題目流程圖",
      "caption": "圖1：題目流程圖"
    }
  ],
  "options": {
    "A": "正確敘述",
    "B": "錯誤敘述"
  },
  "answer": "A",
  "explanation": "本題答案為 A，因為圖中流程符合 A 的敘述。",
  "explanationImages": [
    {
      "src": "assets/images/Q005_explanation.png",
      "alt": "詳解流程圖",
      "caption": "圖2：詳解標註圖"
    }
  ],
  "tags": ["圖片題"],
  "difficulty": "medium",
  "chapter": "圖片題"
}
```

## 圖片檔案要放在哪裡

圖片建議放在：

```text
assets/images/
```

支援副檔名：

- `.png`
- `.jpg`
- `.jpeg`
- `.webp`
- `.gif`
- `.svg`

圖片路徑一律使用相對路徑，例如：

```text
assets/images/example.png
```

若圖片不存在，題目仍可顯示，但圖片區會顯示「圖片無法載入」與圖片路徑。

## 題目圖片與詳解圖片格式

```json
{
  "src": "assets/images/example.png",
  "alt": "圖片替代文字",
  "caption": "圖片說明"
}
```

`src` 是圖片相對路徑，`alt` 是無障礙替代文字，`caption` 是顯示在圖片下方的說明。

## 如何讓 GitHub Actions 自動產生 question-banks.json

本專案已提供：

```text
scripts/build-question-index.js
.github/workflows/build-question-index.yml
```

當你把新的題庫 JSON 放入 `questions/` 並 push 到 `main` 分支時，GitHub Actions 會：

1. 讀取 `questions/` 中所有 `.json` 題庫檔。
2. 檢查 JSON 格式與必要欄位。
3. 從每個題庫檔讀取題庫基本資料。
4. 自動產生 `question-banks.json`。
5. 若檔案有變更，自動 commit 並 push 回 repository。

如果某個 JSON 格式錯誤，Actions 會失敗，並在執行紀錄中顯示錯誤原因。

你也可以在本機手動執行：

```bash
node scripts/build-question-index.js
```

## 如何部署到 GitHub Pages

1. 建立 GitHub repository。
2. 將本專案所有檔案放入 repository。
3. 確認預設分支為 `main`。
4. 到 repository 的 `Settings`。
5. 進入 `Pages`。
6. Source 選擇 `Deploy from a branch`。
7. Branch 選擇 `main`，資料夾選擇 `/root`。
8. 儲存後等待 GitHub Pages 部署完成。

部署完成後，首頁會讀取 `question-banks.json` 顯示題庫列表。

## 如何使用匯入題庫功能

在首頁點選「匯入題庫 JSON」，選擇本機的 `.json` 題庫檔。系統會檢查格式，格式正確後加入題庫清單。匯入題庫儲存在瀏覽器 localStorage，重新整理後仍可使用。

若匯入題庫的 `bankId` 與既有匯入題庫重複，系統會詢問是否覆蓋。

注意：匯入題庫若包含圖片，圖片路徑仍需指向網站中存在的相對路徑。匯入功能只匯入 JSON，不會上傳圖片到 GitHub Pages。

## 如何匯出錯題紀錄

進入「錯題本」頁面，可使用：

- 匯出錯題本 JSON
- 匯出錯題本 CSV

CSV 欄位包含題庫名稱、題庫 ID、題目 ID、題型、題目內容、圖片路徑、使用者答案、正確答案、是否答對、答題時間、錯誤次數、詳解與詳解圖片路徑。

## 如何備份與還原本機資料

進入「資料管理」頁面，可使用：

- 匯出所有本機資料 JSON
- 匯入本機資料備份
- 清除所有本機資料

建議定期匯出備份，尤其是在大量匯入題庫、累積錯題本或收藏題目後。

## localStorage 限制說明

本系統沒有後端資料庫，所有個人資料都存在瀏覽器 localStorage。限制如下：

1. 不同瀏覽器之間不會同步。
2. 不同裝置之間不會同步。
3. 使用無痕模式可能無法長期保存。
4. 清除瀏覽資料會刪除 localStorage。
5. localStorage 容量有限，不適合存放大量圖片或大型檔案。
6. 圖片檔不會被存入 localStorage，請放在 `assets/images/` 並用相對路徑引用。

## 如何使用 AI 生成題庫提示詞

網站首頁提供「AI 生成題庫說明」按鈕。此頁面內建完整提示詞，可複製給 ChatGPT、Claude、Gemini 等外部 AI 工具使用。

建議流程：

1. 點選「AI 生成題庫說明」。
2. 按「複製提示詞」或「下載提示詞 .txt」。
3. 將提示詞貼到外部 AI 工具。
4. 上傳或貼上 PDF、Word、圖片辨識文字、教材內容或官方題庫資料。
5. 要求 AI 依照提示詞輸出合法 JSON。
6. 人工檢查題目、答案、詳解與圖片路徑。
7. 將 JSON 儲存為 `.json` 檔。
8. 正式使用時放入 `questions/` 並 push 到 GitHub；臨時個人使用時可直接用網站「匯入題庫」功能。

注意事項：

- AI 產生的題庫仍需人工檢查。
- 官方題目與答案不可任意改寫。
- 如果原始資料有圖片，圖片檔要另外放入 `assets/images/`。
- JSON 裡的圖片路徑要與實際檔案位置一致。
- 網站不串接 AI API，也不在前端放置 API Key。

## 常見錯誤排除

### 首頁沒有題庫

請檢查：

1. `question-banks.json` 是否存在。
2. `question-banks.json` 是否是合法 JSON 陣列。
3. 題庫的 `enabled` 是否為 `true`。
4. GitHub Pages 是否已重新部署。

### 題庫無法載入

請檢查：

1. `question-banks.json` 中的 `file` 路徑是否正確。
2. 題庫 JSON 是否放在 `questions/` 資料夾。
3. 題庫 JSON 是否包含必要欄位。
4. JSON 是否有多餘逗號或格式錯誤。

### GitHub Actions 失敗

請打開 Actions 執行紀錄，查看 `Build question-banks.json` 步驟的錯誤訊息。常見原因包括：

1. JSON 格式錯誤。
2. 題庫缺少 `bankId`、`title`、`questions` 等必要欄位。
3. 題目缺少 `id`、`type`、`question`、`answer`、`explanation`。
4. 題型不是 `single_choice`、`multiple_choice`、`true_false`、`fill_blank`。
5. 圖片物件缺少 `src`、`alt` 或 `caption`。
6. `bankId` 或題目 `id` 重複。

### 圖片無法顯示

請檢查：

1. 圖片是否真的存在於 `assets/images/`。
2. JSON 中 `src` 路徑是否拼錯。
3. 檔名大小寫是否一致。
4. 副檔名是否為支援格式。
5. GitHub Pages 是否已包含該圖片檔。

### 匯入題庫後圖片無法顯示

匯入題庫只會把 JSON 存到 localStorage，不會把圖片上傳到網站。若題庫引用 `assets/images/Q001.png`，該圖片仍必須已存在於 GitHub Pages 的 `assets/images/` 路徑下。

### localStorage 資料消失

可能原因：

1. 清除了瀏覽資料。
2. 換了瀏覽器或裝置。
3. 使用無痕模式。
4. 瀏覽器自動清理網站資料。

建議使用「資料管理」中的「匯出所有本機資料 JSON」定期備份。
