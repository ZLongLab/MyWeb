@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo 未找到 Node.js。你可以先直接双击 index.html 查看网站。
  echo 如需本地服务器，请安装 Node.js 后再次运行此文件。
  pause
  exit /b 1
)
node server.mjs --open
if errorlevel 1 pause
endlocal
