# PLAN_ZH

> 中文對照稿。正式繳交檔為 repo root 的 `PLAN.md`。

## How I planned and broke down the task

1. 使用 AI 協助建立專案架構與開發規劃，先整理出 `AI_ZH.md` 作為 advisory engineering notes。
2. 依照文件優先順序確認需求來源：`BRIEF.md` 作為最高優先規格，`README.md` 作為詳細實作需求，`AI_ZH.md` 僅作為工程建議，不視為硬性規格。
3. 開發前先盤點 starter repo：檢查 `package.json`、`src/` 結構、mock data、UnoCSS semantic tokens、Quasar 與 UnoCSS 設定。
4. 先檢查 UI 基礎設定（字型、顏色、semantic tokens）。之後實作過程中若發現與設計或規格不一致、或有錯誤，再額外補齊與修正。
5. 從第一階段開始依序完成報名流程各步驟。因 Figma Dev Mode 未能成功使用，改以 Figma 截圖搭配 Codex 實作（依我的經驗，截圖驅動對 UI 還原成功率較高），並逐一檢查各元件 CSS。
6. 開發過程中持續抽出 / 補增共用元件，並逐步強化跨步驟頁面邏輯（state、驗證、定價、衝突處理）。
7. 同步在此文件（以及 `PROMPT.md`）記錄實際決策、AI 使用情況、問題與取捨。

## Key decisions and why I made them

1. **VIP 票種自動帶入午餐套票**  
   VIP 規格包含午餐，因此在選擇 VIP 時直接把對應 meal 設為已選且不可移除，避免使用者漏選，也避免價格與權益說明不一致。

2. **Workshop 與 Session 時間重疊：標示不可用 + 警告文案**  
   若 Step 3 workshop 與 Step 2 已選 session 時間重疊，除了不可選擇外，在卡片下方顯示警告訊息，讓原因更清楚，而不是只顯示 disabled。

3. **元件分層改為 Layout / Common / Atoms**  
   AI 初版架構可跑，但分層不夠清楚。我後續依 `layout`（導覽、步驟條、footer）、`common`（卡片、tabs、summary）、`atoms`（欄位、stepper 等）重整，讓步驟頁較薄、共用 UI 較好維護。

4. **選取態邊線用 box-shadow，避免 1px → 2px 造成寬度跳動**  
   若直接把 border 從 1px 加到 2px，元件佔位會變大。改以 `box-shadow` 模擬外圈邊線，讓 selected / hover 視覺變粗但不推擠 layout。

## Why I chose each additional dependency

1. **`vue-i18n`（runtime）**  
   - 解決什麼：BRIEF nice-to-have 的 i18n，把導覽、步驟、按鈕、部分文案抽成語系。  
   - 替代方案：硬編碼字串、或自製極簡 dictionary。  
   - 為什麼選它：Vue 生態標準方案，與 Composition API / `useI18n` 整合直接。

2. **`gh-pages`（devDependency）**  
   - 解決什麼：一鍵把 `dist/spa` 佈到 GitHub Pages（`yarn deploy:git`）。  
   - 替代方案：GitHub Actions、手動上傳。  
   - 為什麼選它：本機一條指令即可部署；部署本身不在評分範圍。

其餘如 date-fns、lodash-es 等沒有額外引入。

## How I used AI tools

1. 初期請 AI 閱讀規格並提出架構建議，整理成 `AI_ZH.md`；再人工對照 `BRIEF.md` / `README.md`。
2. 較大、較難的區塊主要用 **Codex（GPT-5.5）**，並在 `PROMPT.md` 留下紀錄。
3. 小型修正多用 **Cursor Auto**。
4. 多數產出可用，但 AI 初版架構分層不夠理想；後來用 Layout / Common / Atoms 手動重整。
5. UI 還原因 Dev Mode 未成功，改以「Figma 截圖 + Codex」為主，再人工比對。

## Challenges encountered and how I solved them

1. **Figma Dev Mode 未能成功使用**  
   改走截圖驅動 AI + 人工比對。

2. **選取邊線加粗導致 layout 位移**  
   改用 box-shadow 畫外圈邊線。

3. **Figma 字級設定不完整**  
   部分字級在設計檔不夠完整，實作時依畫面觀感與既有 typography shortcuts 補上合理數值，並優先對齊 semantic tokens。

4. **Workshop 時間衝突訊息**  
   只 disabled 不夠清楚，因此在衝突的 workshop 卡片下方加上明確警告文案。

## What I would improve given more time

1. 若 Figma Dev Mode 可穩定使用，預估可更接近官方 6–8 小時完成；目前用截圖讓 AI 做、再人工比對，整體時間會稍長。
2. 補齊更完整的 typography token 對照，減少設計檔字級缺值時的歧義。
