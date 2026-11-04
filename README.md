# 泰雅文化 3D 學習群島｜第一版

原創的 Three.js + Vite 國小文化互動學習網站。技術概念參考石門國小品牌群島公開專案，但 3D 形狀、教材、操作介面與程式均為本專案原創。

## 已完成
- 3 座真正的 WebGL 3D 浮空島：山林智慧、泰雅織布、部落生活。
- 滑鼠/觸控旋轉、縮放，點擊島嶼後鏡頭平滑靠近；也可用文字按鈕選島。
- 每島：學習目標、3 個知識卡、1 個選擇式思考活動、6 道三選一素養題（總計 18 題）。
- 答錯提示與重答、答對說明、完成六題取得徽章。進度在 `localStorage`，不送到雲端。
- 可關閉的原創柔和音樂、低刺激模式（停止浮動並降低像素比例）、純文字模式、WebGL 失敗備援、鍵盤操作與焦點樣式。
- 自動化題庫檢查與 GitHub Pages Actions 部署流程。

## Windows 啟動
1. 安裝 Node.js LTS：https://nodejs.org/
2. 下載本專案 ZIP 並解壓，使用 VS Code 開啟 `atayal-islands` 資料夾。
3. 在終端機執行：

```powershell
npm install
npm run check
npm run dev
```

4. 打開終端機提供的網址（通常是 http://localhost:5173/）。
5. 發佈前執行 `npm run build`，輸出在 `dist/`。不可以直接雙擊原始碼的 `index.html`，必須使用 Vite 開發伺服器或上傳打包後的 `dist/`。

## 發布 GitHub Pages
1. 在 GitHub 建立新的 **public** repository（例如 `atayal-islands`）。
2. 將這份專案的所有檔案（含隱藏的 `.github/workflows/deploy.yml`）上傳至儲存庫的 `main` 分支。**請不要上傳 `node_modules`。**
3. 工作流程已使用 `npm install`，不需要事先上傳鎖定檔；建議本機安裝後一併提交 `package-lock.json`，以利後續版本管理。
4. 進入 Repository → Settings → Pages → Build and deployment，選擇 **GitHub Actions**。
5. 打開 Actions 頁籤，確認 Deploy Vite website to GitHub Pages 執行成功。
6. 網址通常會是 `https://你的帳號.github.io/atayal-islands/`。工作流程會依 repository 名稱自動設定 Vite 的 `base` 路徑。

## 教材修改
編輯 `src/data.js`。每座島有 `name`、`goal`、`facts`、`activity` 與 `questions`。題目格式：

```js
['問題文字',['選項A','選項B','選項C'],正確選項索引0到2,'答題引導與解說']
```

修改後執行 `npm run check` 確認題目資料完整。

## 文化與資料倫理
- 第一版為**教學示例**；Gaga、鳥占、分享制度與織紋等會因地區、族群及情境而有差異，正式教學前請由在地耆老或文化教師檢視。
- 沒有自動替文化圖案加上未經查證的族語名稱。
- 不收集姓名、學號、照片或個人資訊；同一裝置的使用者會共享進度，請在共用電腦上點選「清除本機進度」。
- 背景音樂是 Web Audio API 產生的原創音調，**不是**泰雅傳統樂曲。
- 因音效需點按才開始，符合瀏覽器自動播放限制。
- 3D 模式需要支援 WebGL 的現代瀏覽器；遇到問題可切換文字模式。

## 後續版本
先邀請學生測試三座島，確認操作及閱讀難度，再擴充樂舞、社會探索與彩虹挑戰三座島；亦可新增教師匯入題庫、朗讀與無障礙閱讀功能。

## 驗證記錄
目前已通過 `node scripts/check.mjs` 與主要 JavaScript 語法檢查。此製作環境無法成功完成 npm 套件下載，因此 **尚未實際執行 Vite build 與瀏覽器 WebGL 畫面驗證**。下載後請依上方步驟執行 `npm install`、`npm run build`，如遇錯誤請提供終端機訊息。
