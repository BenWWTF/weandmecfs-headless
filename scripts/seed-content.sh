#!/usr/bin/env bash
# seed-content.sh — load WordPress and run scripts/seed-content.php.
# This populates the local install with the WE&ME stories, calls,
# projects, team, partners and guardians so the homepage has real data
# to show.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

WP_DIR="${WP_DIR:-wp}"

if [[ ! -f "${WP_DIR}/wp-load.php" ]]; then
  echo "WordPress is not installed yet. Run scripts/setup-wp.sh first." >&2
  exit 1
fi

echo "→ Seeding content…"
php -d display_errors=1 -d error_reporting=E_ALL -r "
  define( 'WP_USE_THEMES', false );
  require '${WP_DIR}/wp-load.php';
  require '${REPO_ROOT}/scripts/seed-content.php';
"
echo "✓ Done."
