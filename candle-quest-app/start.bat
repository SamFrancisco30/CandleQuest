@echo off
echo 🕯️ CandleQuest - 盘感训练应用
echo ================================
echo.
echo 正在启动应用...
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否已安装依赖
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

REM 启动应用
echo 🚀 启动开发服务器...
echo 应用将在浏览器中自动打开
echo 如果没有自动打开，请访问: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.
npm start

pause

