@echo off
echo Starting Alzheimer's Prediction App...

start cmd /k "python -m uvicorn backend.main:app --reload"
start cmd /k "cd frontend && npm run dev"

echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:5173
echo.
echo Press any key to exit this launcher (terminals will remain open)...
pause
