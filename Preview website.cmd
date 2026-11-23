@echo off
rem Double-click to preview the website locally. Close this window to stop.
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is needed to run the preview: https://nodejs.org & pause & exit /b 1)
node tools\preview.js
pause
