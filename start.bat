@echo off
setlocal
cd /d "%~dp0"
if not exist "backend\venv\Scripts\python.exe" (
  echo Backend environment not found.
  echo Run setup first:
  echo   cd backend
  echo   python -m venv venv
  echo   venv\Scripts\activate
  echo   python -m pip install -r requirements.txt
  pause
  exit /b 1
)
if not exist "frontend\exec-agent\node_modules" (
  echo Frontend dependencies not found.
  echo Run setup first:
  echo   cd frontend\exec-agent
  echo   npm install
  pause
  exit /b 1
)
start "Executive Agent - Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"
start "Executive Agent - Frontend" cmd /k "cd /d "%~dp0frontend\exec-agent" && npm run dev"
echo Backend and frontend are starting in separate windows.
endlocal
