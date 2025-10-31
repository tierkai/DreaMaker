@echo off
chcp 65001 >nul
title 神经梦境实验室 - 本地开发环境

echo 🧠 神经梦境实验室 - 本地开发环境启动
echo ================================================

echo 📋 检查系统环境...

REM 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js 18+ 版本
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=1 delims=." %%a in ('node --version') do (
    set NODE_MAJOR=%%a
    set NODE_MAJOR=!NODE_MAJOR:v=!
)

if !NODE_MAJOR! lss 18 (
    echo ❌ Node.js 版本过低 (当前:)，需要 18+ 版本
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node --version

REM 检查包管理器
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=pnpm
    echo ✅ 使用 pnpm 包管理器
    goto :install_deps
)

where yarn >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=yarn
    echo ✅ 使用 yarn 包管理器
    goto :install_deps
)

where npm >nul 2>&1
if %errorlevel% equ 0 (
    set PACKAGE_MANAGER=npm
    echo ✅ 使用 npm 包管理器
    goto :install_deps
)

echo ❌ 未找到包管理器，请安装 pnpm、yarn 或 npm
pause
exit /b 1

:install_deps
echo.
echo 📦 安装项目依赖...

if "%PACKAGE_MANAGER%"=="pnpm" (
    pnpm install
) else if "%PACKAGE_MANAGER%"=="yarn" (
    yarn install
) else (
    npm install
)

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo ✅ 依赖安装完成

REM 检查环境变量文件
if not exist ".env.local" (
    echo.
    echo ⚠️  未找到 .env.local 文件，正在创建...
    if exist ".env.example" (
        copy ".env.example" ".env.local" >nul
        echo ✅ 已从 .env.example 创建 .env.local
        echo ⚠️  请编辑 .env.local 文件，填入你的 Supabase 配置
    ) else (
        echo ❌ 未找到 .env.example 文件
        pause
        exit /b 1
    )
)

REM 检查构建
echo.
echo 🔨 检查项目构建...

if "%PACKAGE_MANAGER%"=="pnpm" (
    pnpm build
) else if "%PACKAGE_MANAGER%"=="yarn" (
    yarn build
) else (
    npm run build
)

if %errorlevel% neq 0 (
    echo ❌ 项目构建失败
    pause
    exit /b 1
)

echo ✅ 项目构建成功

REM 启动开发服务器
echo.
echo 🚀 启动开发服务器...
echo 📍 访问地址: http://localhost:5173
echo ⏹️  按 Ctrl+C 停止服务器
echo.

if "%PACKAGE_MANAGER%"=="pnpm" (
    pnpm dev
) else if "%PACKAGE_MANAGER%"=="yarn" (
    yarn dev
) else (
    npm run dev
)

pause