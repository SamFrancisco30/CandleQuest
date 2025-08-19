#!/bin/bash

echo "🕯️ CandleQuest - 盘感训练应用"
echo "================================"
echo ""

echo "正在启动应用..."
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未检测到Node.js"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
fi

# 启动应用
echo "🚀 启动开发服务器..."
echo "应用将在浏览器中自动打开"
echo "如果没有自动打开，请访问: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm start

