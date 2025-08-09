# AI Prompt 优化工具

[![GitHub stars](https://img.shields.io/github/stars/WonderLand33/prompt-optimizer?style=social)](https://github.com/WonderLand33/prompt-optimizer)
[![GitHub forks](https://img.shields.io/github/forks/WonderLand33/prompt-optimizer?style=social)](https://github.com/WonderLand33/prompt-optimizer)
[![GitHub issues](https://img.shields.io/github/issues/WonderLand33/prompt-optimizer)](https://github.com/WonderLand33/prompt-optimizer/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个基于 Cloudflare Pages 和 Functions 的 AI Prompt 优化工具，使用 React 作为前端框架，通过 OpenAI API 提供智能的 Prompt 优化服务。

🌟 **[在线演示](https://systemprompt.icu)** | 📖 **[项目文档](https://github.com/WonderLand33/prompt-optimizer/wiki)** | 🐛 **[问题反馈](https://github.com/WonderLand33/prompt-optimizer/issues)**

## 功能特性

- 🤖 **AI 驱动**: 使用 OpenAI GPT 模型优化 Prompt
- 🛡️ **安全验证**: 集成 Cloudflare Turnstile 防止滥用
- 🎨 **OpenAI 风格 UI**: 仿照 OpenAI 官网的设计风格
- 🌙 **夜间模式**: 支持明暗主题切换，自动适配系统偏好
- 📡 **流式输出**: 支持 Server-Sent Events (SSE) 实时显示优化过程
- ⚡ **快速部署**: 基于 Cloudflare Pages 和 Functions
- 🔒 **环境变量配置**: 所有敏感信息通过环境变量管理
- 📱 **响应式设计**: 完美适配桌面端和移动端

## 技术栈

- **前端**: React + Vite + Tailwind CSS
- **后端**: Cloudflare Functions (Node.js)
- **部署**: Cloudflare Pages + Wrangler
- **AI 服务**: OpenAI API
- **验证**: Cloudflare Turnstile

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入相应的配置：

```bash
cp .env.example .env
```

需要配置的环境变量：
- `OPENAI_API_KEY`: OpenAI API 密钥
- `OPENAI_API_URL`: OpenAI API 地址
- `OPENAI_MODEL`: 使用的模型
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile 密钥
- `TURNSTILE_SITE_KEY`: Cloudflare Turnstile 站点密钥
- `OPENAI_PROMPT`: 优化的 Prompt

### 3. 本地开发

```bash
# 启动开发服务器
npm run dev

# 在另一个终端启动 Functions 开发服务器
npm run functions:dev
```

### 4. 构建项目

```bash
npm run build
```

### 5. 部署到 Cloudflare

首先确保已安装并登录 Wrangler：

```bash
# 安装 Wrangler（如果还没安装）
npm install -g wrangler

# 登录 Cloudflare
wrangler login
```

然后部署项目：

```bash
# 部署到 Cloudflare Pages
npm run deploy
```

## 配置说明

### Cloudflare Turnstile 设置

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 "Turnstile" 部分
3. 创建新的站点
4. 获取 Site Key 和 Secret Key
5. 将密钥添加到环境变量中

### OpenAI API 设置

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建 API Key
3. 将 API Key 添加到环境变量中

### Wrangler 配置

在 `wrangler.toml` 中配置环境变量：

```toml
[env.production.vars]
OPENAI_API_KEY = "your_api_key"
TURNSTILE_SECRET_KEY = "your_secret_key"
```

## 项目结构

```
prompt.icu/
├── src/                    # React 前端源码
│   ├── App.jsx            # 主应用组件
│   ├── main.jsx           # 应用入口
│   └── index.css          # 全局样式
├── functions/             # Cloudflare Functions
│   └── api/
│       └── optimize-prompt.js  # Prompt 优化 API
├── public/                # 静态资源
├── dist/                  # 构建输出
├── package.json           # 项目配置
├── wrangler.toml         # Cloudflare 配置
├── vite.config.js        # Vite 配置
├── tailwind.config.js    # Tailwind 配置
└── README.md             # 项目文档
```

## API 接口

### POST /api/optimize-prompt

优化 Prompt 的 API 接口。

**请求体:**
```json
{
  "prompt": "需要优化的原始 Prompt",
  "turnstileToken": "Turnstile 验证 token"
}
```

**响应:**
```json
{
  "optimizedPrompt": "优化后的 Prompt"
}
```

## 开发路线图

- [x] 基础 Prompt 优化功能
- [x] Cloudflare Turnstile 集成
- [x] OpenAI 风格 UI 设计
- [x] 夜间模式支持
- [x] SSE 流式输出
- [ ] 多语言支持 (i18n)
- [ ] Prompt 模板库
- [ ] 历史记录功能
- [ ] 用户账户系统
- [ ] API 使用统计
- [ ] 更多 AI 模型支持

## 贡献指南

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 如何贡献

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 开发环境设置

```bash
# 克隆仓库
git clone https://github.com/WonderLand33/prompt-optimizer.git
cd prompt-optimizer

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API 密钥

# 启动开发服务器
npm run dev
```

## 问题反馈

如果你遇到任何问题或有功能建议，请：

1. 查看 [已知问题](https://github.com/WonderLand33/prompt-optimizer/issues)
2. 如果问题不存在，请 [创建新的 Issue](https://github.com/WonderLand33/prompt-optimizer/issues/new)

## 致谢

- [OpenAI](https://openai.com/) - 提供强大的 AI 模型
- [Cloudflare](https://cloudflare.com/) - 提供优秀的边缘计算平台
- [React](https://reactjs.org/) - 构建用户界面的 JavaScript 库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的开源图标库

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 联系方式

- GitHub: [@WonderLand33](https://github.com/WonderLand33)
- 项目链接: [https://github.com/WonderLand33/prompt-optimizer](https://github.com/WonderLand33/prompt-optimizer)

---

⭐ 如果这个项目对你有帮助，请给它一个 Star！