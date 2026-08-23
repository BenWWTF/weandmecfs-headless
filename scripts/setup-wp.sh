#!/usr/bin/env bash
# setup-wp.sh — install WordPress core in ./wp/, link the headless plugin
# and theme, create the database, and run the WP installer.
#
# Idempotent: re-running is safe; the script checks before each step.
#
# Requirements: PHP 8.1+, MySQL 9.x reachable, WP-CLI optional.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

WP_DIR="wp"
WP_VERSION="6.7.2"
DB_NAME="${WEANDME_DB_NAME:-weandmecfs_local}"
DB_USER="${WEANDME_DB_USER:-root}"
DB_PASS="${WEANDME_DB_PASS:-}"
DB_HOST="${WEANDME_DB_HOST:-127.0.0.1}"
DB_PORT="${WEANDME_DB_PORT:-3306}"
SITE_URL="${WEANDME_SITE_URL:-http://localhost:8080}"
SITE_TITLE="${WEANDME_SITE_TITLE:-WE&ME Foundation (local)}"
ADMIN_USER="${WEANDME_ADMIN_USER:-admin}"
ADMIN_PASS="${WEANDME_ADMIN_PASS:-admin}"
ADMIN_EMAIL="${WEANDME_ADMIN_EMAIL:-admin@example.com}"

log() { printf "\033[1;34m→\033[0m %s\n" "$*"; }
ok()  { printf "\033[1;32m✓\033[0m %s\n" "$*"; }
err() { printf "\033[1;31m✗\033[0m %s\n" "$*" >&2; exit 1; }

command -v php  >/dev/null || err "PHP not found. Install via Homebrew: brew install php"
command -v mysql >/dev/null || err "mysql client not found. Install via Homebrew: brew install mysql-client"

PHP_VERSION="$(php -r 'echo PHP_VERSION;')"
[[ "${PHP_VERSION%%.*}" -ge 8 ]] || err "PHP 8.1+ required (you have ${PHP_VERSION})"

# 1. Download WordPress core if not present.
if [[ ! -f "${WP_DIR}/wp-load.php" ]]; then
  log "Downloading WordPress ${WP_VERSION}…"
  mkdir -p "${WP_DIR}"
  curl -fsSL "https://wordpress.org/wordpress-${WP_VERSION}.tar.gz" | tar xz -C "${WP_DIR}" --strip-components=1
  ok "WordPress core installed"
else
  ok "WordPress core already present"
fi

# 2. wp-config.php.
if [[ ! -f "${WP_DIR}/wp-config.php" ]]; then
  log "Generating wp-config.php…"
  cat > "${WP_DIR}/wp-config.php" <<PHP
<?php
define( 'DB_NAME',     '${DB_NAME}' );
define( 'DB_USER',     '${DB_USER}' );
define( 'DB_PASSWORD', '${DB_PASS}' );
define( 'DB_HOST',     '${DB_HOST}' );
define( 'DB_CHARSET',  'utf8mb4' );
define( 'DB_COLLATE',  '' );

\$_table_prefix = 'wp_';
define( 'WP_DEBUG',         true );
define( 'WP_DEBUG_LOG',     true );
define( 'WP_DEBUG_DISPLAY', false );
define( 'SCRIPT_DEBUG',     false );
define( 'DISALLOW_FILE_EDIT', true );

// The headless theme renders 410 Gone if anything reaches it.
define( 'WP_HOME',    '${SITE_URL}' );
define( 'WP_SITEURL', '${SITE_URL}' );

if ( ! defined( 'ABSPATH' ) ) {
  define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';
PHP
  ok "wp-config.php created"
fi

# 3. Create the database if it doesn't exist.
log "Ensuring database ${DB_NAME} exists on ${DB_HOST}:${DB_PORT}…"
MYSQL_PWD="${DB_PASS}" mysql \
  -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USER}" \
  -e "CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" \
  || err "Failed to create database"
ok "Database ready"

# 3b. Switch to pretty permalinks so the REST endpoints work at
#     /wp-json/ instead of /index.php?rest_route=. The router.php
#     script handles rewrites for the built-in PHP server.
log "Setting permalink structure…"
php -d display_errors=1 -r "
  require '${WP_DIR}/wp-load.php';
  if ( get_option( 'permalink_structure' ) !== '/%postname%/' ) {
    update_option( 'permalink_structure', '/%postname%/' );
    wp_flush_rewrite_rules();
    echo \"Permalinks set.\n\";
  } else {
    echo \"Permalinks already set.\n\";
  }
"

# 4. Link the headless plugin and theme (live so edits to the repo
#    are picked up immediately).
log "Linking wp-content/plugins/weandmecfs-headless/…"
mkdir -p "${WP_DIR}/wp-content/plugins"
if [[ ! -e "${WP_DIR}/wp-content/plugins/weandmecfs-headless" ]]; then
  ln -s "${REPO_ROOT}/wp-content/plugins/weandmecfs-headless" \
        "${WP_DIR}/wp-content/plugins/weandmecfs-headless"
fi
ok "Plugin linked"

log "Linking wp-content/themes/weandmecfs-headless/…"
mkdir -p "${WP_DIR}/wp-content/themes"
if [[ ! -e "${WP_DIR}/wp-content/themes/weandmecfs-headless" ]]; then
  ln -s "${REPO_ROOT}/wp-content/themes/weandmecfs-headless" \
        "${WP_DIR}/wp-content/themes/weandmecfs-headless"
fi
ok "Theme linked"

# 5. Install WordPress if not installed yet.
if [[ ! -f "${WP_DIR}/wp-includes/version.php" ]]; then
  err "WordPress is not properly installed"
fi
log "Running WP install (idempotent)…"
php -d display_errors=1 -r "
  define( 'WP_INSTALLING', true );
  require '${WP_DIR}/wp-load.php';
  require ABSPATH . 'wp-admin/includes/upgrade.php';
  if ( ! is_blog_installed() ) {
    wp_install( '${SITE_TITLE}', '${ADMIN_USER}', '${ADMIN_EMAIL}', true, '', '${ADMIN_PASS}' );
    echo \"WordPress installed.\n\";
  } else {
    echo \"WordPress already installed.\n\";
  }
"

# 6. Activate the headless plugin and theme.
log "Activating headless plugin and theme…"
php -d display_errors=1 -r "
  require '${WP_DIR}/wp-load.php';
  require ABSPATH . 'wp-admin/includes/plugin.php';
  \$plugin = 'weandmecfs-headless/weandmecfs-headless.php';
  if ( is_plugin_inactive( \$plugin ) ) {
    activate_plugin( \$plugin );
  }
  switch_theme( 'weandmecfs-headless' );
  echo \"Active theme: \" . get_stylesheet() . \"\n\";
"
ok "Setup complete"

cat <<EOF

Next steps:
  1. scripts/seed-content.sh     # adds the stories, calls, projects, etc.
  2. scripts/dev.sh              # starts WP (:8080) + Next.js (:3000)

Admin: ${SITE_URL}/wp-admin  (${ADMIN_USER} / ${ADMIN_PASS})
EOF
