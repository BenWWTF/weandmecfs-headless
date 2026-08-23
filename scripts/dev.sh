#!/usr/bin/env bash
# dev.sh — start WordPress on :8080 and Next.js on :3000 side by side.
#
#   WP:      http://localhost:8080/wp-admin   (admin / admin)
#   Frontend: http://localhost:3000
#
# The frontend reads the WP REST endpoint at http://localhost:8080/wp-json/wp/v2.
# Use scripts/setup-wp.sh once before this script.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

WP_DIR="wp"
WEB_DIR="web"

if [[ ! -f "${WP_DIR}/wp-load.php" ]]; then
  echo "WordPress is not installed yet. Run scripts/setup-wp.sh first." >&2
  exit 1
fi

# Pick the package manager the repo is set up with.
if command -v pnpm >/dev/null 2>&1; then
  PKG="pnpm"
elif command -v bun  >/dev/null 2>&1; then
  PKG="bun"
else
  PKG="npm"
fi

if [[ ! -d "${WEB_DIR}/node_modules" ]]; then
  echo "→ Installing Next.js dependencies with ${PKG}…"
  (cd "${WEB_DIR}" && ${PKG} install)
fi

cleanup() {
  echo "→ Stopping dev servers…"
  kill 0 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "→ Starting WordPress on :8080 (php -S with router.php)…"
(cd "${WP_DIR}" && php -S 127.0.0.1:8080 -t . router.php >/tmp/weandme-wp.log 2>&1) &
WP_PID=$!
sleep 1

echo "→ Starting Next.js on :3000 (${PKG} dev)…"
(cd "${WEB_DIR}" && ${PKG} dev >/tmp/weandme-next.log 2>&1) &
NEXT_PID=$!
sleep 2

cat <<EOF

┌──────────────────────────────────────────────────────────────────┐
│  WordPress:    http://localhost:8080/wp-admin  (admin / admin)   │
│  REST API:     http://localhost:8080/wp-json/wp/v2/             │
│  Frontend:     http://localhost:3000                            │
│  WP log:       tail -f /tmp/weandme-wp.log                      │
│  Next log:     tail -f /tmp/weandme-next.log                    │
└──────────────────────────────────────────────────────────────────┘

Press Ctrl-C to stop both.
EOF

wait $WP_PID $NEXT_PID
