#!/usr/bin/env bash
# ============================================================
#  <stadt.hub> — open this folder offline
#
#  Run this script. It serves the folder it sits in over local
#  HTTP and opens it in your browser. No internet needed.
#
#  Why this exists: opening index.html directly (file://) leaves
#  the maps and the 3D embeds blank. They are ES-module bundles,
#  and browsers refuse to load those from a file:// page. Serving
#  over http:// is what makes them work.
#
#  To stop: press Ctrl+C.
# ============================================================
set -euo pipefail

cd "$(dirname "$0")"

PORT=__PORT__
URL="http://localhost:${PORT}/"

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
else
  echo
  echo "  Python 3 was not found."
  echo
  echo "  Serve this folder with any static web server and open:"
  echo "      ${URL}"
  echo
  echo "  For example, with Node installed:  npx serve -l ${PORT}"
  echo
  exit 1
fi

echo
echo "  Serving this folder at ${URL}"
echo "  Press Ctrl+C to stop."
echo

# Open the browser once the server is up, without blocking the server itself.
( sleep 2
  if command -v open >/dev/null 2>&1; then open "${URL}"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "${URL}"
  else echo "  Open ${URL} in your browser."
  fi ) &

exec "$PY" -m http.server "$PORT" --bind 127.0.0.1
