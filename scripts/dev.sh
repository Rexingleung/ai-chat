#!/bin/bash

# AI Chat 开发环境启动脚本
# 使用方法: ./scripts/dev.sh

set -e

echo "🔧 启动 AI Chat 开发环境..."

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 检测到缺少依赖，正在安装..."
    npm install
fi

if [ ! -d "workers/node_modules" ]; then
    echo "📦 检测到 Workers 缺少依赖，正在安装..."
    cd workers
    npm install
    cd ..
fi

# 启动 Workers 开发服务器
echo "☁️ 启动 Workers 开发服务器..."
cd workers
wrangler dev --port 8787 &
WORKERS_PID=$!
cd ..

echo "⏳ 等待 Workers 服务器启动..."
sleep 3

# 启动前端开发服务器
echo "🌐 启动前端开发服务器..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 开发环境启动完成！"
echo ""
echo "📍 服务地址:"
echo "  前端: http://localhost:3000"
echo "  Workers: http://localhost:8787"
echo "  GraphQL Playground: http://localhost:8787/graphql"
echo ""
echo "💡 提示:"
echo "  - 按 Ctrl+C 停止所有服务"
echo "  - 前端会自动重新加载"
echo "  - Workers 需要手动重启以应用更改"
echo ""

# 等待用户中断
trap "echo '🛑 正在停止服务...'; kill $WORKERS_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
