<?php
/**
 * On-demand revalidation.
 *
 * When an editor clicks "Publish" or "Update" in wp-admin, this class
 * fires a signed POST to the Next.js /api/revalidate endpoint with the
 * list of paths that depend on the changed post. Next.js then
 * revalidates them, so the live site reflects the change within seconds
 * — no wait for the ISR window to expire.
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

final class WeAndMe_Headless_Revalidation {

	private const OPTION_KEY = 'weandme_headless_revalidation';

	public function register(): void {
		foreach ( array_keys( WeAndMe_Headless_CPT::SCHEMA ) as $slug ) {
			add_action( "save_post_{$slug}", [ $this, 'on_save' ], 20, 3 );
			add_action( "trashed_post",       [ $this, 'on_trash' ] );
		}
		add_action( 'save_post_post', [ $this, 'on_save_post' ], 20, 3 );
		add_action( 'save_post_page', [ $this, 'on_save_page' ], 20, 3 );
	}

	/* ------------------------------------------------------------------ *
	 *  Settings (admin URL + secret) live in wp_options.
	 * ------------------------------------------------------------------ */

	public static function get_url(): string {
		return (string) get_option( self::OPTION_KEY . '_url', '' );
	}

	public static function get_secret(): string {
		return (string) get_option( self::OPTION_KEY . '_secret', '' );
	}

	/* ------------------------------------------------------------------ *
	 *  Hooks
	 * ------------------------------------------------------------------ */

	public function on_save( int $post_id, \WP_Post $post, bool $update ): void {
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		if ( $post->post_status !== 'publish' ) {
			return;
		}

		$paths = $this->paths_for_post( $post );
		$this->dispatch( $post->post_type, $post_id, $paths );
	}

	public function on_save_post( int $post_id, \WP_Post $post, bool $update ): void {
		$this->on_save( $post_id, $post, $update );
	}

	public function on_save_page( int $post_id, \WP_Post $post, bool $update ): void {
		$this->on_save( $post_id, $post, $update );
	}

	public function on_trash( int $post_id ): void {
		$post = get_post( $post_id );
		if ( $post ) {
			$this->dispatch( $post->post_type, $post_id, [ '/' ] );
		}
	}

	/* ------------------------------------------------------------------ *
	 *  Paths to revalidate
	 * ------------------------------------------------------------------ */

	/**
	 * Map a post to the Next.js routes that show it. Keep this list
	 * explicit — it's the source of truth for "which pages changed when
	 * an editor saves a post".
	 *
	 * @return string[]
	 */
	public function paths_for_post( \WP_Post $post ): array {
		$type = $post->post_type;
		$slug = $post->post_name;

		$paths = [ '/' ]; // homepage almost always changes

		switch ( $type ) {
			case 'story':
				$paths[] = '/stories';
				$paths[] = "/stories/{$slug}";
				break;
			case 'project':
				$paths[] = '/research';
				$paths[] = "/research/{$slug}";
				break;
			case 'call':
				$paths[] = '/research';
				$paths[] = '/support';
				break;
			case 'team':
				$paths[] = '/about';
				break;
			case 'partner':
				$paths[] = '/about';
				$paths[] = '/support';
				break;
			case 'event':
				$paths[] = '/news';
				break;
			case 'guardian':
				$paths[] = '/support';
				break;
			case 'post':
				$paths[] = '/news';
				$paths[] = "/news/{$slug}";
				break;
			case 'page':
				$path = $post->post_name === '' ? '/' : '/' . $post->post_name;
				$paths[] = $path;
				break;
		}

		return array_values( array_unique( $paths ) );
	}

	/* ------------------------------------------------------------------ *
	 *  Dispatch
	 * ------------------------------------------------------------------ */

	private function dispatch( string $type, int $post_id, array $paths ): void {
		$url     = self::get_url();
		$secret  = self::get_secret();
		if ( $url === '' || $secret === '' ) {
			return; // not configured yet — no-op
		}

		$body = [
			'type'   => $type,
			'id'     => $post_id,
			'paths'  => $paths,
			'ts'     => time(),
		];
		$body['sig'] = hash_hmac( 'sha256', wp_json_encode( $body ), $secret );

		wp_remote_post( $url, [
			'timeout'   => 4,
			'blocking'  => false,
			'sslverify' => true,
			'headers'   => [ 'Content-Type' => 'application/json' ],
			'body'      => wp_json_encode( $body ),
		] );
	}
}
