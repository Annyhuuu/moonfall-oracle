# 🌙 月落占语 · 部署教程（零基础版）

从零开始，把这个塔罗 app 部署到公网，生成一个可以用手机打开的链接。

**全程大概 15-20 分钟。**

---

## 📋 你需要准备的

1. 一个邮箱（能注册 GitHub 和 Vercel 就行，Gmail / QQ 邮箱 / 163 都可以）
2. 一张能国际支付的信用卡 **(可选，DeepSeek 国内充值即可，Vercel 免费不用卡)**
3. 能访问 GitHub 和 Vercel 的网络

---

## 第一步：吊销旧 Key + 生成新 Key ⚠️ **必做**

你之前在聊天里发过 key，那个 key 已经不再安全，必须废掉。

### 1.1 打开 DeepSeek 平台

浏览器打开 👉 https://platform.deepseek.com

登录你的账号（之前生成那个 key 用的账号）。

### 1.2 删除旧 key

1. 左侧菜单点 **「API keys」**（或 "API 密钥"）
2. 找到以 `sk-a6e08ae0...` 开头的那个 key
3. 点它右边的 **🗑️ 删除** / **Revoke** 按钮
4. 确认删除

### 1.3 生成新 key

1. 在同一页面点 **「Create API Key」** / **「创建 API 密钥」** 按钮
2. 给它起个名字，比如 `moonfall-oracle`
3. 点确认 → 页面会显示一串以 `sk-` 开头的新 key
4. **立即复制**这个 key，粘贴到你电脑的临时记事本里（关闭页面就再也看不到了）
5. **这次不要发给任何人，包括我**

### 1.4 确认余额

在 DeepSeek 平台主页看一下余额。如果是 0，点「充值」充个 10 块钱足够用很久（每次占卜约消耗 ¥0.0015，10 块够用几千次）。

---

## 第二步：注册 GitHub（如果还没有）

打开 👉 https://github.com/signup

用邮箱注册一个账号，过程很简单。**记住用户名和密码**。

---

## 第三步：上传代码到 GitHub

### 3.1 下载项目 zip

我会在最后给你一个 `sacred-triad-tarot.zip`，下载后**解压**到一个你能找到的文件夹，比如桌面。

解压后里面应该有：
```
sacred-triad-tarot/
├── index.html
├── api/
│   └── tarot.js
├── vercel.json
├── package.json
├── .gitignore
└── README.md
```

### 3.2 创建新仓库

1. 登录 GitHub，右上角点 **「+」→ 「New repository」**
2. **Repository name** 填：`moonfall-oracle`（或你喜欢的名字）
3. 下面的选项：
   - 选 **Public**（公开，不影响安全，因为 key 不在代码里）
   - 或 **Private**（私有，更保险）
4. **不要**勾选 "Add a README file" / "Add .gitignore"（我们已经有了）
5. 点 **「Create repository」**

### 3.3 上传文件

创建后会看到一个空仓库页面。有两种方法：

#### 方法 A · 网页拖拽上传（最简单，推荐新手）

1. 点页面中间 **「uploading an existing file」** 这个蓝色链接
2. 把解压出来的文件夹里的**所有文件**（包括 `api` 这个子文件夹）拖到网页上
   - ⚠️ 注意：是把**文件夹里面的内容**拖上去，不是把整个文件夹拖上去
3. 下方 **Commit changes** 写：`init`
4. 点 **「Commit changes」** 按钮

上传可能要等 30 秒左右。完成后应该能看到 `index.html`、`api/`、`vercel.json` 这些文件。

> 💡 如果 `.gitignore` 这个以点开头的文件拖不上去，没关系，不影响部署。

#### 方法 B · 用命令行（如果你熟悉 Git）

```bash
cd sacred-triad-tarot
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/你的用户名/moonfall-oracle.git
git push -u origin main
```

---

## 第四步：部署到 Vercel

### 4.1 注册 / 登录 Vercel

打开 👉 https://vercel.com

点右上角 **「Sign Up」** 或 **「Login」**：
- 选 **「Continue with GitHub」**（用 GitHub 账号登录，最方便）
- 授权 Vercel 访问你的 GitHub

### 4.2 导入项目

1. 登录后会到一个面板，点 **「Add New...」→「Project」**
2. 会看到你 GitHub 里的所有仓库列表
3. 找到 `moonfall-oracle`，点它右边的 **「Import」** 按钮

### 4.3 配置环境变量（**关键步骤**）

导入后进入一个配置页面，**先别急着点 Deploy**。

1. 往下滚，找到 **「Environment Variables」** 折叠区域
2. 点开它
3. 填两个字段：
   - **Key（键名）**：`DEEPSEEK_API_KEY`（注意大写，必须一字不差）
   - **Value（值）**：粘贴你第一步复制的那个新 `sk-...` key
4. 点右边的 **「Add」** 按钮

看到列表里出现一条 `DEEPSEEK_API_KEY = sk-xxxx...` 就对了。

> 📷 这一步是整个教程的核心。如果忘了配，部署后调用 AI 会报错。

### 4.4 其他设置保持默认

Framework Preset、Build Command、Output Directory 都**不用动**，Vercel 会自动识别。

### 4.5 Deploy

点底部 **「Deploy」** 大蓝按钮。

Vercel 开始部署，你会看到一堆日志滚动，大概 30-60 秒。

### 4.6 完成

部署成功后会有一个庆祝动画，然后点 **「Continue to Dashboard」** 或直接看页面中间的域名。

你会看到一个形如 `moonfall-oracle-xxx.vercel.app` 的 URL——**这就是你的 app 链接**。

---

## 第五步：测试

### 5.1 电脑测试

1. 在 Vercel 页面点那个 `xxx.vercel.app` 链接
2. 应该会看到月落占语的首页
3. 输入一个你真正在纠结的问题（比如："我该不该辞掉现在的工作？"）
4. 点「开始占卜」→ 抽 3 张牌 → 翻完 3 张牌 → 下滑
5. 看综合解析**有没有围绕你的问题展开**

### 5.2 检查 AI 是否真的在工作

看综合解析里的内容：
- ✅ **正常**：内容提到了你的具体问题（比如辞职/工作/当前处境），语言通顺自然
- ❌ **异常**：内容只是堆砌牌的关键词，不涉及你的问题 → 说明 API 没调通，走了 fallback

如果异常，看下一步。

### 5.3 如果出错怎么办

**去 Vercel 后台查日志：**

1. 回到 Vercel 的项目页面
2. 顶部点 **「Logs」** 标签（或 "Functions" → 选中 `tarot`）
3. 做一次占卜，在日志里搜 `error`

常见错误：

| 日志内容 | 原因 | 解决 |
|---|---|---|
| `Server API key not configured` | 环境变量没配对 | 回 4.3 重新配 `DEEPSEEK_API_KEY` |
| `Upstream API error: 401` | key 是错的或被删 | 去 DeepSeek 重新生成 key |
| `Upstream API error: 402` | 余额不足 | 去 DeepSeek 充值 |
| `Upstream API error: 429` | 触发限流 | 过一会再试 |

**改完环境变量后要重新部署：**
- Vercel → Deployments → 最新那个的右边 `⋯` → Redeploy

### 5.4 手机测试

用手机浏览器（Safari / Chrome）直接打开 `xxx.vercel.app`。

**把链接"添加到主屏幕"**：
- iOS：Safari 底部分享按钮 → "添加到主屏幕"
- 安卓：Chrome 右上菜单 → "添加到主屏幕"

之后点主屏图标就像打开 app 一样。

---

## 🎉 完成！

现在你已经有一个线上运行的塔罗 app 了。

**链接随便分享给谁都可以**，别人用不会消耗你的 key（因为 key 在后端）。但他们每次占卜会扣你的 DeepSeek 余额。

---

## 🛡️ 安全加固（可选但建议）

如果你怕被陌生人刷爆余额，有几个选项：

### 选项 A · 给 DeepSeek 账户设消费上限

DeepSeek 平台 → 「账户设置」 → 设置每日/每月消费上限为比如 ¥5。超了自动停。

### 选项 B · 改为只允许你自己的域名调用

编辑 `api/tarot.js`：

```js
// 把这行
res.setHeader('Access-Control-Allow-Origin', '*');

// 改成
res.setHeader('Access-Control-Allow-Origin', 'https://moonfall-oracle-xxx.vercel.app');
```

然后推送到 GitHub，Vercel 会自动重新部署。

### 选项 C · 加请求频率限制

用 Vercel KV 或 Upstash Redis 记录 IP 请求次数。这个稍复杂，需要的话我再教你。

---

## 🔧 常见问题

**Q：我能改默认的 6 个问题标签吗？**
A：能。打开 `index.html`，搜索 `QUICK_TAGS`，改里面的文字即可。改完 push 到 GitHub，Vercel 自动重新部署。

**Q：DeepSeek 不够好，想换别的模型？**
A：`api/tarot.js` 里改 `model: 'deepseek-chat'`：
- 换 **Moonshot（月之暗面）**：`baseURL` 改 `https://api.moonshot.cn/v1`，`model` 改 `moonshot-v1-8k`
- 换 **智谱 GLM**：`baseURL` 改 `https://open.bigmodel.cn/api/paas/v4`，`model` 改 `glm-4`
- 这些都是 OpenAI 兼容接口，改 URL 和 model 名即可

**Q：能绑定我自己的域名吗？**
A：能。Vercel → Settings → Domains → 填你的域名 → 按提示在域名注册商那改 DNS。5 分钟生效。

**Q：部署后每次改代码都要重新推吗？**
A：是的。但只要 push 到 GitHub 的 main 分支，Vercel 会**自动**检测并重新部署，通常 30 秒完成。

---

**部署成功后如果有任何问题，把 Vercel 的 Logs 截图给我，我帮你看。**
