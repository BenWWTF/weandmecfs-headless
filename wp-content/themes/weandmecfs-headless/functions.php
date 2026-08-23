<?php
/**
 * WE&ME Headless theme — bootstrap.
 *
 * Real front-end rendering happens on the Next.js frontend. This theme
 * exists so that:
 *   1. The WordPress admin keeps working.
 *   2. Any front-end request that accidentally reaches WordPress
 *      (e.g. when the Nginx reverse-proxy isn't yet in place during
 *      cutover) gets a clear 410 Gone with a pointer to the live site.
 *
 * @package WeAndMe_Headless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'WEANDME_FRONTEND_URL' ) ) {
	define( 'WEANDME_FRONTEND_URL', 'https://www.weandmecfs.org' );
}

/**
 * Block search engine indexing of anything served by this theme — the
 * canonical URLs live on the Next.js frontend. We also emit a canonical
 * link so even accidental hits are de-duplicated by the search engines.
 *
 * We let WP's own routes through (admin, REST API, GraphQL, media files)
 * and only return 410 for actual front-end page requests — Nginx routes
 * those to Next.js in production, so this branch only fires when something
 * slips through during a cutover or local dev.
 */
add_action( 'template_redirect', static function (): void {
	$path = (string) ( wp_unslash( $_SERVER['REQUEST_URI'] ?? '/' ) );
	// Don't intercept WP's own endpoints.
	$passthrough = (bool) preg_match( '#^/(wp-admin|wp-login\.php|wp-json|graphql|wp-content|wp-includes|xmlrpc\.php|wp-cron\.php|robots\.txt|favicon\.ico|sitemap\.xml|wp-sitemap\.xml)#', $path );
	if ( $passthrough ) {
		return;
	}

	header( 'X-Robots-Tag: noindex, follow', true );
	nocache_headers();
	status_header( 410, 'Gone' );
	header( 'Content-Type: text/html; charset=utf-8' );

	$frontend = esc_url( WEANDME_FRONTEND_URL );
	$target   = $frontend . $path;
	?>
	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>WE&ME Foundation — moved</title>
		<meta name="robots" content="noindex, follow">
		<meta http-equiv="refresh" content="0; url=<?php echo $target; ?>">
		<link rel="canonical" href="<?php echo $target; ?>">
		<style>
			body { font: 16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif;
			       max-width: 40rem; margin: 6rem auto; padding: 0 1.5rem; color: #0e1a10; }
			a { color: #2e73db; }
		</style>
	</head>
	<body>
		<h1>This page has moved</h1>
		<p>The WE&amp;ME Foundation site is now served from a different system.
		   You'll be redirected to <a href="<?php echo $target; ?>"><?php echo $target; ?></a>.</p>
	</body>
	</html>
	<?php
	exit;
}, 1 );

/**
 * Helper: register the Klarheit Grotesk fonts directory so the front
 * can <link> to /wp-content/themes/weandmecfs-headless/fonts/*.woff2 if
 * it wants to (Next.js prefers to host them itself, but having the
 * fonts available here means editors can preview them in the customizer).
 */
add_action( 'init', static function (): void {
	// No-op for now. Fonts ship with the Next.js frontend at /public/fonts.
} );
