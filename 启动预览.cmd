@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo 未找到 Node.js。请先安装 Node.js 22.12 或更新版本。
  pause
  exit /b 1
)
if not exist node_modules\vite (
  echo 首次启动需要安装网站依赖，请在此目录运行 npm install。
  pause
  exit /b 1
)
node server.mjs --open
if errorlevel 1 pause
endlocal
