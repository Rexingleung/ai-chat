#!/bin/bash

# AI Chat 部署脚本
# 使用方法: ./scripts/deploy.sh

set -e

echo "🚀 开始部署 AI Chat 应用..."

# 检查必要的工具
if ! command -v wrangler &> /dev/null; then
    echo "❌ 错误: 未找到 wrangler 命令"
    echo "请先安装 Wrangler: npm install -g wrangler"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查 wrangler 是否已登录
echo "🔐 检查 Cloudflare 登录状态..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ 错误: 未登录 Cloudflare"
    echo "请先登录: wrangler login"
    exit 1
fi

echo "✅ Cloudflare 登录状态正常"

# 构建前端
echo "📦 构建前端应用..."
npm install
npm run build
echo "✅ 前端构建完成"

# 部署 Workers
echo "☁️ 部署 Cloudflare Workers..."
cd workers
npm install
wrangler deploy
echo "✅ Workers 部署完成"

cd ..

echo "🎉 部署完成！"
echo ""
echo "📋 接下来的步骤:"
echo "1. 检查 Workers 部署状态: https://dash.cloudflare.com/"
echo "2. 更新前端配置中的 Workers URL"
echo "3. 部署前端到您的托管平台"
echo ""
echo "📖 详细文档: https://github.com/Rexingleung/ai-chat#readme"
