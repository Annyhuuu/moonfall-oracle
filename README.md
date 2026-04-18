# 🔮 圣三角塔罗占卜 · Vercel 部署指南

一个接入 DeepSeek API 的韦特塔罗占卜 Web App。API key 通过 Vercel Serverless Function 代理，不会暴露在前端。

## 📁 项目结构

```
.
├── index.html          # 前端 (单文件，包含全部 CSS/JS)
├── api/
│   └── tarot.js        # Vercel Serverless Function，代理 DeepSeek API
├── vercel.json         # Vercel 配置
├── package.json        # 项目描述
└── README.md           # 本文件
```

## 🚀 部署步骤

### 第 1 步 · 去 DeepSeek 生成新 Key（必须）

1. 登录 https://platform.deepseek.com
2. **先吊销你之前暴露过的 key**（刚在聊天里发的那个，已不再安全）
3. 生成一个新 key，先保存好不要外泄

### 第 2 步 · 把项目上传到 GitHub

1. 新建一个 GitHub 仓库（可设为 private）
2. 把这个文件夹里的所有文件上传进去
   ```bash
   cd sacred-triad-tarot
   git init
   git add .
   git commit -m "init"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

### 第 3 步 · Vercel 部署

1. 去 https://vercel.com 用 GitHub 登录
2. 点 **Add New → Project**
3. 选择刚才新建的仓库
4. **在 Environment Variables 里添加一个变量：**
   - Name: `DEEPSEEK_API_KEY`
   - Value: 你刚生成的新 key
5. 点 **Deploy**

等 30-60 秒，Vercel 会给你一个 `xxx.vercel.app` 的链接。手机打开即可使用。

### 第 4 步 · 验证

打开网站做一次完整占卜流程：
- 如果综合解析能正常显示 → 成功，DeepSeek API 在工作
- 如果出现"本地生成的兜底文案" → API 调用失败，去 Vercel 后台 **Logs** 看 `api/tarot` 的错误信息

---

## 🔧 本地测试（可选）

如果想本地调试：

```bash
npm i -g vercel
cd sacred-triad-tarot
vercel dev
# 然后在 http://localhost:3000 测试
```

需要在本地建一个 `.env` 文件：
```
DEEPSEEK_API_KEY=sk-你的key
```

（这个 `.env` 文件**千万不要**提交到 GitHub，建议写进 `.gitignore`）

---

## 🛡️ 安全说明

- ✅ API key 存在 Vercel 环境变量里，不会在前端代码中泄露
- ✅ 前端只发送 `question` 和 `cards` 数据到 `/api/tarot`，完整 prompt 在后端构造
- ✅ 后端对 `question` 做了长度校验（≤300 字符）防止滥用
- ⚠️ 目前没有对 IP / 用户做限流，如果怕被刷可以：
  - 在 Vercel 后台给 function 设置 rate limit
  - 或加个简单的图形验证码/Turnstile

---

## 🎨 自定义

- **改模型**：`api/tarot.js` 里 `model: 'deepseek-chat'` 可改为 `deepseek-reasoner`（有 CoT 推理，但速度更慢）
- **改温度**：`temperature: 1.3` 适合创意文本，想更稳定可调低到 1.0
- **改 prompt**：直接改 `api/tarot.js` 里的 `systemPrompt` / `userPrompt`

---

## 💰 DeepSeek 成本参考

- `deepseek-chat` 输入约 ¥1/M tokens、输出约 ¥2/M tokens
- 每次占卜约消耗 500 tokens 输入 + 500 tokens 输出 ≈ ¥0.0015
- 也就是说 **1 块钱能占卜约 600 次**
