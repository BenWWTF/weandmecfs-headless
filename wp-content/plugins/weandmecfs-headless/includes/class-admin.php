<?php
/**
 * Admin UI: settings page for the revalidation webhook + a one-click
 * "Trigger revalidation" button editors can use when they're not sure
 * if the front is up to date.
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

final class WeAndMe_Headless_Admin {

	private const SETTINGS_SLUG = 'weandme-headless';
	private const SETTINGS_GROUP = 'weandme_headless_settings';

	public function __construct( private readonly WeAndMe_Headless_Revalidation $revalidation ) {}

	public function register(): void {
		add_action( 'admin_menu', [ $this, 'menu' ] );
		add_action( 'admin_init', [ $this, 'settings' ] );
		add_action( 'admin_post_weandme_test_revalidation', [ $this, 'handle_test' ] );
		add_action( 'admin_notices', [ $this, 'maybe_show_notice' ] );
	}

	public function menu(): void {
		add_options_page(
			'WE&ME Headless',
			'WE&ME Headless',
			'manage_options',
			self::SETTINGS_SLUG,
			[ $this, 'render_page' ]
		);
	}

	public function settings(): void {
		register_setting( self::SETTINGS_GROUP, WeAndMe_Headless_Revalidation::OPTION_KEY . '_url', [
			'type'              => 'string',
			'sanitize_callback' => 'esc_url_raw',
		] );
		register_setting( self::SETTINGS_GROUP, WeAndMe_Headless_Revalidation::OPTION_KEY . '_secret', [
			'type'              => 'string',
			'sanitize_callback' => 'sanitize_text_field',
		] );
	}

	public function render_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$url    = WeAndMe_Headless_Revalidation::get_url();
		$secret = WeAndMe_Headless_Revalidation::get_secret();
		?>
		<div class="wrap">
			<h1>WE&amp;ME Headless</h1>
			<p>
				Settings for the Next.js frontend. When an editor publishes or
				updates a CPT, WordPress fires a signed POST to the
				<code>/api/revalidate</code> endpoint of the frontend so the
				live site reflects the change in seconds.
			</p>

			<form method="post" action="options.php">
				<?php settings_fields( self::SETTINGS_GROUP ); ?>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="revalidate_url">Frontend revalidate URL</label></th>
						<td>
							<input
								type="url"
								id="revalidate_url"
								name="<?php echo esc_attr( WeAndMe_Headless_Revalidation::OPTION_KEY . '_url' ); ?>"
								value="<?php echo esc_attr( $url ); ?>"
								class="regular-text code"
								placeholder="https://www.weandmecfs.org/api/revalidate"
							/>
							<p class="description">
								The full URL to Next.js's revalidation endpoint.
							</p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="revalidate_secret">Shared secret</label></th>
						<td>
							<input
								type="text"
								id="revalidate_secret"
								name="<?php echo esc_attr( WeAndMe_Headless_Revalidation::OPTION_KEY . '_secret' ); ?>"
								value="<?php echo esc_attr( $secret ); ?>"
								class="regular-text code"
							/>
							<p class="description">
								Must match <code>REVALIDATION_SECRET</code> in the
								Next.js environment. Use a long random string
								(<code>openssl rand -hex 32</code>).
							</p>
						</td>
					</tr>
				</table>
				<?php submit_button(); ?>
			</form>

			<hr/>

			<h2>Test revalidation</h2>
			<p>Fire a one-off revalidation of the homepage to confirm the wiring works.</p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="weandme_test_revalidation"/>
				<?php wp_nonce_field( 'weandme_test_revalidation' ); ?>
				<?php submit_button( 'Revalidate /', 'secondary', 'submit', false ); ?>
			</form>
		</div>
		<?php
	}

	public function handle_test(): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Forbidden' );
		}
		check_admin_referer( 'weandme_test_revalidation' );

		$url     = WeAndMe_Headless_Revalidation::get_url();
		$secret  = WeAndMe_Headless_Revalidation::get_secret();
		if ( $url === '' || $secret === '' ) {
			wp_safe_redirect( add_query_arg( 'weandme_revalidate', 'unconfigured', admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG ) ) );
			exit;
		}

		$body = [
			'type'  => 'manual',
			'id'    => 0,
			'paths' => [ '/' ],
			'ts'    => time(),
		];
		$body['sig'] = hash_hmac( 'sha256', wp_json_encode( $body ), $secret );

		$res = wp_remote_post( $url, [
			'timeout'   => 5,
			'blocking'  => true,
			'sslverify' => true,
			'headers'   => [ 'Content-Type' => 'application/json' ],
			'body'      => wp_json_encode( $body ),
		] );

		if ( is_wp_error( $res ) ) {
			wp_safe_redirect( add_query_arg( 'weandme_revalidate', 'error', admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG ) ) );
		} else {
			wp_safe_redirect( add_query_arg( 'weandme_revalidate', 'ok', admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG ) ) );
		}
		exit;
	}

	public function maybe_show_notice(): void {
		if ( ! isset( $_GET['weandme_revalidate'] ) ) {
			return;
		}
		$status = sanitize_key( wp_unslash( (string) $_GET['weandme_revalidate'] ) );
		$msg    = match ( $status ) {
			'ok'           => [ 'success', 'Revalidation fired. Check the live site in a few seconds.' ],
			'error'        => [ 'error', 'Revalidation request failed. Check the URL and the secret.' ],
			'unconfigured' => [ 'warning', 'Set the revalidation URL and secret first.' ],
			default        => null,
		};
		if ( ! $msg ) {
			return;
		}
		printf(
			'<div class="notice notice-%1$s is-dismissible"><p>%2$s</p></div>',
			esc_attr( $msg[0] ),
			esc_html( $msg[1] )
		);
	}
}
