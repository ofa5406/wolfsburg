@echo off
REM ============================================================
REM  <stadt.hub> — Summaery exhibition launcher
REM  Serves the deck over local HTTP and opens it fullscreen in
REM  Chrome kiosk mode. Works fully offline.
REM
REM  Why this is needed: the map / hub embeds are ES-module
REM  bundles, which browsers refuse to load from a double-clicked
REM  file (file://). The deck MUST be served over http://, which
REM  is exactly what this script does.
REM
REM  To run: double-click this file.
REM  To quit the show: press Alt+F4, then close the little server
REM  window that stays behind.
REM ============================================================
setlocal EnableDelayedExpansion

REM --- serve from the repo root: this script is in exhibition\deck\ ---
cd /d "%~dp0..\.."

REM --- pick a Python launcher (py -3, then python) ---
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY ( where python >nul 2>nul && set "PY=python" )
if not defined PY (
  echo.
  echo   Python 3 was not found on this PC.
  echo   Install it from python.org, or serve this folder with any static server,
  echo   then open  http://localhost:8777/exhibition/deck/index.html
  echo.
  pause
  exit /b 1
)

set "PORT=8777"
set "URL=http://localhost:%PORT%/exhibition/deck/index.html"

REM --- start the local server in its own window ---
start "stadt.hub server (leave open during the show)" %PY% -m http.server %PORT% --bind 127.0.0.1

REM --- wait ~2s for it to come up ---
ping -n 3 127.0.0.1 >nul

REM --- locate Chrome ---
set "CHROME="
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined CHROME if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if defined CHROME (
  "%CHROME%" --kiosk --autoplay-policy=no-user-gesture-required ^
    --no-first-run --no-default-browser-check --disable-infobars ^
    --disable-session-crashed-bubble --disable-features=Translate ^
    --user-data-dir="%TEMP%\stadthub-kiosk" "%URL%"
) else (
  echo Chrome not found - opening in the default browser instead.
  start "" "%URL%"
)

endlocal
