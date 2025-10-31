#!/bin/bash

# 神经梦境实验室 - 快速启动脚本
# 适用于 macOS 和 Linux 系统

echo "🧠 神经梦境实验室 - 本地开发环境启动"
echo "================================================"

# 检查Node.js版本
echo "📋 检查系统环境..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 18+ 版本"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 版本过低 (当前: $(node --version))，需要 18+ 版本"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查包管理器
if command -v pnpm &> /dev/null; then
    PACKAGE_MANAGER="pnpm"
    echo "✅ 使用 pnpm 包管理器"
elif command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    echo "✅ 使用 yarn 包管理器"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "✅ 使用 npm 包管理器"
else
    echo "❌ 未找到包管理器，请安装 pnpm、yarn 或 npm"
    exit 1
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "⚠️  未找到 .env.local 文件，正在创建..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ 已从 .env.example 创建 .env.local"
        echo "⚠️  请编辑 .env.local 文件，填入你的 Supabase 配置"
    else
        echo "❌ 未找到 .env.example 文件"
        exit 1
    fi
fi

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm install
elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn install
else
    npm install
fi

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 检查构建
echo ""
echo "🔨 检查项目构建..."
if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm build
elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn build
else
    npm run build
fi

if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败"
    exit 1
fi

echo "✅ 项目构建成功"

# 启动开发服务器
echo ""
echo "🚀 启动开发服务器..."
echo "📍 访问地址: http://localhost:5173"
echo "⏹️  按 Ctrl+C 停止服务器"
echo ""

if [ "$PACKAGE_MANAGER" = "pnpm" ]; then
    pnpm dev
elif [ "$PACKAGE_MANAGER" = "yarn" ]; then
    yarn dev
else
    npm run dev
fi