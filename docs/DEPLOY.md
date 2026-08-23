# Deploying to the Nessus box

This document covers the production cutover. The plan is staged so
the WP site stays live throughout, and the new frontend goes behind
a flag first, then flips to the canonical root.

## Pre-flight

You'll need:

- SSH access to the Nessus box as a user that can run `systemctl` and
  write to `/var/www/weandmecfs.org`.
- Node.js 22 installed (or installable). Nessus boxes typically don't
  ship with Node; use NodeSource:
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt install -y nodejs
  ```
- pnpm 10+ (optional; npm works too):
  ```bash
  npm install -g pnpm
  ```
- The shared secret for the revalidation webhook, generated with:
  ```bash
  openssl rand -hex 32
  ```
  Store it in 1Password / Bitwarden, not in the repo.

## 1. Install the WP plugin and theme

```bash
cd /var/www/weandmecfs.org/wp-content
git clone <your-fork-or-this-repo>/weandmecfs-headless.git
cp -r weandmecfs-headless/wp-content/plugins/weandmecfs-headless plugins/
cp -r weandmecfs-headless/wp-content/themes/weandmecfs-headless themes/
```

In `wp-admin`:
- Plugins → activate **WE&ME Headless CMS**.
- Appearance → activate the **WE&ME Headless** theme.
- Settings → **WE&ME Headless** → set the **Frontend revalidate URL**
  to `https://www.weandmecfs.org/api/revalidate` and paste the shared
  secret. Click "Revalidate /" to test.

The old `weandmecfs` theme stays on disk; the headless theme is now
the active one and immediately starts responding 410 Gone to any
front-end request that reaches WP (which won't be any, once Nginx
is reconfigured — see below).

## 2. Build and serve the Next.js frontend

```bash
cd /var/www/weandmecfs.org
git clone <your-fork>/weandmecfs-headless.git app
cd app/web
pnpm install --frozen-lockfile
pnpm build
```

This produces `.next/`. Run it with a systemd service:

```ini
# /etc/systemd/system/weandmecfs-web.service
[Unit]
Description=WE&ME Foundation Next.js frontend
After=network.target

[Service]
Type=simple
User=weandmecfs-web
WorkingDirectory=/var/www/weandmecfs.org/app/web
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=WP_BASE_URL=https://www.weandmecfs.org
Environment=SITE_URL=https://www.weandmecfs.org
Environment=WEANDME_REVALIDATION_SECRET=__set_in_etc_weandmecfs_web_env__
ExecStart=/usr/bin/node node_modules/next/dist/bin/next start --port 3000
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now weandmecfs-web
systemctl status weandmecfs-web
```

The frontend listens on `127.0.0.1:3000`. It is **not** exposed to
the public — only Nginx talks to it.

## 3. Nginx vhost

Replace the existing `server` block for weandmecfs.org with:

```nginx
server {
  listen 443 ssl http2;
  server_name weandmecfs.org www.weandmecfs.org;

  ssl_certificate     /etc/letsencrypt/live/weandmecfs.org/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/weandmecfs.org/privkey.pem;

  # Security headers — match what the WP-only site already sends.
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
  add_header X-Frame-Options          "SAMEORIGIN" always;
  add_header X-Content-Type-Options   "nosniff" always;
  add_header Referrer-Policy          "no-referrer" always;

  # 32 MB body limit, mostly for the media uploads path.
  client_max_body_size 32m;

  # Static media files — let WP serve them directly.
  location /wp-content/ {
    root /var/www/weandmecfs.org;
    expires 30d;
    add_header Cache-Control "public, max-age=2592000, immutable";
    try_files $uri =404;
  }

  # The WP admin and REST/GraphQL API.
  location ~ ^/(wp-admin|wp-login\.php|wp-json|graphql|xmlrpc\.php|wp-includes) {
    root /var/www/weandmecfs.org;
    index index.php;
    try_files $uri $uri/ /index.php?$args;

    location ~ \.php$ {
      include snippets/fastcgi-php.conf;
      fastcgi_pass unix:/run/php/php8.3-fpm.sock;
      fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
  }

  # The Next.js revalidation webhook.
  location = /api/revalidate {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 10s;
  }

  # Everything else → the Next.js frontend.
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;
  }
}
```

Validate and reload:

```bash
nginx -t
systemctl reload nginx
```

## 4. Smoke test

- `https://www.weandmecfs.org/` — homepage (Next.js)
- `https://www.weandmecfs.org/about` — about page (Next.js)
- `https://www.weandmecfs.org/wp-admin` — WordPress admin (still works)
- `https://www.weandmecfs.org/wp-json/wp/v2/story` — REST API still works
- In `wp-admin` → Settings → WE&ME Headless → "Revalidate /" — fires
  the webhook; the page should refresh within 1-2 s.

## 5. Rollback

If anything goes wrong, two options:

**A. Quickest: revert the Nginx vhost to the old PHP-only routing.**
WordPress keeps serving the old theme. No data lost. ~30 s.

**B. Disable the headless theme.** Appearance → activate the old
`weandmecfs` theme. WordPress starts rendering pages again. ~30 s.

The Next.js service can be left running in the background; it does
no harm if Nginx isn't routing to it.

## 6. Post-cutover monitoring

- `journalctl -u weandmecfs-web -f` — frontend logs
- `tail -f /var/log/nginx/weandmecfs.org.access.log` — request log
- `wp-admin` → Settings → WE&ME Headless → "Revalidate /" button
  becomes the editor's manual "force-refresh" tool

## Things to remember

- The shared secret must match between
  `/etc/weandmecfs-web.env` (or the systemd Environment= line) and
  `wp-admin` → Settings → WE&ME Headless. If they drift, WP fires
  the webhook and Next.js returns 401.
- Klarheit Grotesk is licensed. The four woff2 files must be dropped
  into `web/public/fonts/` before the build. Don't commit them to
  the repo if your fork is public.
- `next.config.ts` whitelists `www.weandmecfs.org` and `localhost`
  for `next/image`. If you serve media from a CDN later, add it
  there.
