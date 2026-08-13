@echo off
REM ============================================================
REM  <stadt.hub> — open this folder offline
REM
REM  Double-click this file. It serves the folder it sits in over
REM  local HTTP and opens it in your browser. No internet needed.
REM
REM  Why this exists: opening index.html directly (file://) leaves
REM  the maps and the 3D embeds blank. They are ES-module bundles,
REM  and browsers refuse to load those from a double-clicked file.
REM  Serving over http:// is what makes them work.
REM
REM  To stop: close the small server window that stays open.
REM ============================================================
setlocal EnableDelayedExpansion

REM --- serve the folder this script is in ---
cd /d "%~dp0"

set "PORT=__PORT__"
set "URL=http://localhost:%PORT%/"

REM --- find a Python 3 launcher ---
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY ( where python >nul 2>nul && set "PY=python" )
if not defined PY (
  echo.
  echo   Python 3 was not found on this PC.
  echo.
  echo   Serve this folder with any static web server and open:
  echo       %URL%
  echo.
  echo   For example, with Node installed:  npx serve -l %PORT%
  echo.
  pause
  exit /b 1
)

echo.
echo   Serving this folder at %URL%
echo   Leave the server window open while you browse.
echo.

start "stadt.hub local server (leave open)" %PY% -m http.server %PORT% --bind 127.0.0.1

REM --- give the server a moment, then open the browser ---
ping -n 3 127.0.0.1 >nul
start "" "%URL%"

endlocal
