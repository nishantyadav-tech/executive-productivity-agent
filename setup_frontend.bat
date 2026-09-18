@echo off
cd /d "%~dp0frontend\exec-agent"
npm install
npm run build
pause
