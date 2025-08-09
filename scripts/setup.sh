#!/bin/bash

# AI Chat 项目初始化脚本
# 使用方法: ./scripts/setup.sh

set -e

echo "🛠️ 初始化 AI Chat 项目..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 检查通过"

# 安装前端依赖
echo "📦 安装前端依赖..."
npm install
echo "✅ 前端依赖安装完成"

# 安装 Workers 依赖
echo "📦 安装 Workers 依赖..."
cd workers
npm install
echo "✅ Workers 依赖安装完成"

cd ..

# 检查 wrangler
if ! command -v wrangler &> /dev/null; then
    echo "⚠️ 未找到 wrangler，正在全局安装..."
    npm install -g wrangler
    echo "✅ Wrangler 安装完成"
else
    echo "✅ Wrangler 已安装"
fi

echo ""
echo "🎉 项目初始化完成！"
echo ""
echo "📋 接下来的步骤:"
echo "1. 登录 Cloudflare: wrangler login"
echo "2. 创建 KV 命名空间: "
echo "   wrangler kv:namespace create \"CHAT_DB1\""
echo "   wrangler kv:namespace create \"RATE_LIMIT1\""
echo "   wrangler kv:namespace create \"CHAT_DB1\" --preview"
echo "   wrangler kv:namespace create \"RATE_LIMIT1\" --preview"
echo "3. 更新 workers/wrangler.toml 中的 KV namespace ID"
echo "4. 设置 OpenAI API 密钥在 workers/wrangler.toml 中"
echo "5. 运行开发服务器: npm run dev"
echo ""
echo "📖 详细文档: https://github.com/Rexingleung/ai-chat#readme"
