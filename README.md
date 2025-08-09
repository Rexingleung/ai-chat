# AI Chat 🤖

一个基于 React + TypeScript + Cloudflare Workers + GraphQL 构建的现代化 AI 聊天应用。**默认使用 DeepSeek API**，也支持 OpenAI。

## ✨ 特性

- 🚀 **现代化技术栈**: React 18 + TypeScript + Vite + Tailwind CSS
- 🌐 **GraphQL API**: 基于 Cloudflare Workers 的高性能后端
- 🗞️ **数据持久化**: 使用 Cloudflare KV 存储聊天历史
- ⚡ **实时交互**: 流畅的打字效果和动画
- 🔒 **安全防护**: 内置速率限制和内容验证
- 🎨 **精美设计**: 响应式设计，支持深色模式
- 📱 **移动端友好**: 完美适配手机和平板
- 🤖 **多AI支持**: DeepSeek (默认) / OpenAI GPT 系列

## 💻 技术栈

### 前端
- **React 18** - 现代化的 UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Apollo Client** - GraphQL 客户端
- **Lucide React** - 精美的图标库

### 后端
- **Cloudflare Workers** - 边缘计算平台
- **GraphQL Yoga** - 现代化的 GraphQL 服务器
- **Cloudflare KV** - 分布式键值存储
- **DeepSeek API** - 默认AI对话能力 (也支持OpenAI)

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 或 yarn
- Cloudflare 账户
- **DeepSeek API 密钥** (推荐) 或 OpenAI API 密钥

### 1. 克隆项目

```bash
git clone https://github.com/Rexingleung/ai-chat.git
cd ai-chat
```

### 2. 安装前端依赖

```bash
npm install
```

### 3. 设置 Cloudflare Workers

```bash
cd workers
npm install
```

### 4. 配置环境变量

#### 获取 DeepSeek API 密钥

1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册并登录账户
3. 在 API Keys 页面创建新的 API 密钥
4. 复制密钥备用

#### 创建 KV 命名空间

```bash
# 创建生产环境的 KV 命名空间
wrangler kv:namespace create "CHAT_DB"
wrangler kv:namespace create "RATE_LIMIT"

# 创建预览环境的 KV 命名空间
wrangler kv:namespace create "CHAT_DB" --preview
wrangler kv:namespace create "RATE_LIMIT" --preview
```

#### 更新 wrangler.toml

将创建的 KV 命名空间 ID 更新到 `workers/wrangler.toml` 文件中：

```toml
[[kv_namespaces]]
binding = "CHAT_DB"
id = "your-chat-db-namespace-id"
preview_id = "your-chat-db-preview-id"

[[kv_namespaces]]
binding = "RATE_LIMIT"
id = "your-rate-limit-namespace-id"
preview_id = "your-rate-limit-preview-id"

[vars]
AI_API_URL = "https://api.deepseek.com/v1/chat/completions"
AI_API_KEY = "your-deepseek-api-key"
AI_MODEL = "deepseek-chat"
MAX_MESSAGES_PER_HOUR = "60"
MAX_MESSAGE_LENGTH = "2000"
```

#### 切换到 OpenAI (可选)

如果您想使用 OpenAI 而不是 DeepSeek，请修改环境变量：

```toml
[vars]
AI_API_URL = "https://api.openai.com/v1/chat/completions"
AI_API_KEY = "your-openai-api-key"
AI_MODEL = "gpt-3.5-turbo"
# 其他配置保持不变...
```

### 5. 部署 Workers

```bash
cd workers
wrangler deploy
```

### 6. 更新前端配置

在 `src/main.tsx` 中更新 Apollo Client 的 URI：

```typescript
const client = new ApolloClient({
  uri: 'https://ai-chat-graphql.your-account.workers.dev/graphql', // 替换为您的 Workers 域名
  // ...
})
```

### 7. 启动开发服务器

```bash
# 返回根目录
cd ..

# 启动前端开发服务器
npm run dev
```

### 8. 构建生产版本

```bash
npm run build
```

构建文件将输出到 `dist` 目录。

## 🤖 支持的AI模型

应用支持多种AI模型，通过修改 `AI_MODEL` 环境变量即可切换：

### DeepSeek 模型 (推荐)
- `deepseek-chat` - 通用对话模型 (默认)
- `deepseek-coder` - 代码专用模型

### OpenAI 模型
- `gpt-3.5-turbo` - 经典对话模型
- `gpt-4` - 高质量对话模型
- `gpt-4-turbo-preview` - 最新预览版本

## 📁 项目结构

```
ai-chat/
├── src/                    # 前端源代码
│   ├── components/         # React 组件
│   ├── graphql/           # GraphQL 相关
│   ├── hooks/             # 自定义 Hooks
│   ├── types/             # TypeScript 类型定义
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 应用入口
│   └── index.css          # 全局样式
├── workers/               # Cloudflare Workers 后端
│   ├── src/
│   │   ├── utils/         # 工具函数
│   │   ├── context.ts     # GraphQL 上下文
│   │   ├── index.ts       # Workers 入口
│   │   ├── resolvers.ts   # GraphQL 解析器
│   │   └── schema.ts      # GraphQL Schema
│   ├── package.json
│   ├── tsconfig.json
│   └── wrangler.toml      # Workers 配置
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🔧 配置说明

### 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `AI_API_URL` | AI API 地址 | `https://api.deepseek.com/v1/chat/completions` |
| `AI_API_KEY` | AI API 密钥 | - |
| `AI_MODEL` | 使用的AI模型 | `deepseek-chat` |
| `MAX_MESSAGES_PER_HOUR` | 每小时最大消息数 | `60` |
| `MAX_MESSAGE_LENGTH` | 单条消息最大长度 | `2000` |

### KV 存储结构

#### CHAT_DB
- `session:{sessionId}` - 存储聊天会话数据

#### RATE_LIMIT
- `rate_limit:{clientIP}:{hourTimestamp}` - 存储速率限制数据

## 📊 API 文档

### GraphQL Schema

```graphql
type Query {
  chatHistory(sessionId: String!): ChatSession
  rateLimit: RateLimitInfo
  health: String
}

type Mutation {
  sendMessage(content: String!, sessionId: String): MessageResponse!
  createSession(title: String): SessionResponse!
}
```

## 🛡️ 安全特性

- **速率限制**: 每个 IP 每小时最多 60 条消息
- **内容验证**: 过滤不当内容和恶意输入
- **CORS 保护**: 配置适当的跨域资源共享
- **错误处理**: 完善的错误捕获和处理机制
- **API 密钥安全**: 环境变量保护敏感信息

## 🔍 性能优化

- **代码分割**: 使用 Vite 的动态导入进行代码分割
- **缓存策略**: KV 存储自动过期，减少存储成本
- **边缘计算**: Cloudflare Workers 在全球边缘节点运行
- **GraphQL**: 精确查询，减少数据传输
- **模型优化**: DeepSeek 模型针对中文优化，响应更快

## 💰 成本优势

使用 DeepSeek 相比 OpenAI 有显著的成本优势：

- **DeepSeek**: ~￥0.002/1K tokens (输入) + ~￥0.006/1K tokens (输出)
- **OpenAI GPT-3.5**: ~￥0.01/1K tokens (输入) + ~￥0.02/1K tokens (输出)
- **节省成本**: DeepSeek 成本约为 OpenAI 的 1/5

## 🚀 部署脚本

项目提供了自动化部署脚本：

```bash
# 项目初始化
npm run setup

# 开发环境启动
npm run dev:all

# 生产部署
npm run deploy
```

## 🐛 故障排除

### 常见问题

1. **Workers 部署失败**
   - 检查 `wrangler.toml` 配置是否正确
   - 确认 KV 命名空间 ID 是否正确
   - 验证 DeepSeek API 密钥是否有效

2. **前端连接失败**
   - 检查 Apollo Client URI 是否正确
   - 确认 Workers 是否成功部署
   - 查看浏览器网络面板的错误信息

3. **AI 回复失败**
   - 检查 DeepSeek API 密钥余额
   - 验证 API 调用频率是否超限
   - 查看 Workers 日志获取详细错误

### 调试命令

```bash
# 查看 Workers 日志
wrangler tail

# 测试 Workers 本地开发
wrangler dev

# 验证 KV 数据
wrangler kv:key list --binding=CHAT_DB
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Cloudflare Workers](https://workers.cloudflare.com/) - 边缘计算平台
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) - GraphQL 服务器
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库
- [DeepSeek](https://platform.deepseek.com/) - AI 能力提供商

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 创建 [Issue](https://github.com/Rexingleung/ai-chat/issues)
- 发送邮件至：rexingleung@126.com

---

⭐ 如果这个项目对您有帮助，请给它一个星标！

🤖 **现在就体验 DeepSeek 驱动的智能对话吧！**