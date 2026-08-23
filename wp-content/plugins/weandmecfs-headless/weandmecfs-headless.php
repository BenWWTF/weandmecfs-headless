<?php
/**
 * Plugin Name: WE&ME Headless CMS
 * Description: Custom Post Types, meta fields, and revalidation webhook
 *              for the headless weandmecfs.org frontend.
 * Version:     0.1.0
 * Author:      WE&ME Foundation
 * Requires PHP: 8.1
 * Text Domain: weandme-headless
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

define( 'WEANDME_HEADLESS_VERSION', '0.1.0' );
define( 'WEANDME_HEADLESS_FILE', __FILE__ );
define( 'WEANDME_HEADLESS_DIR', plugin_dir_path( __FILE__ ) );
define( 'WEANDME_HEADLESS_URL', plugin_dir_url( __FILE__ ) );

// Subclasses (one per concern) are autoloaded by class name → file name.
//   WeAndMe_Headless_CPT          → includes/class-cpt.php
//   WeAndMe_Headless_Meta         → includes/class-meta.php
//   WeAndMe_Headless_Rest         → includes/class-rest.php
//   WeAndMe_Headless_Revalidation → includes/class-revalidation.php
//   WeAndMe_Headless_Admin        → includes/class-admin.php
//   WeAndMe_Headless_GraphQL      → includes/class-graphql.php
spl_autoload_register( static function ( string $class ): void {
	if ( strpos( $class, 'WeAndMe_Headless_' ) !== 0 ) {
		return;
	}
	$tail   = substr( $class, strlen( 'WeAndMe_Headless_' ) );   // "CPT", "Meta", …
	$file   = WEANDME_HEADLESS_DIR . 'includes/class-' . strtolower( $tail ) . '.php';
	if ( is_readable( $file ) ) {
		require_once $file;
	}
} );

/**
 * Boot the plugin. Each subsystem registers its own hooks; the bootstrap
 * just wires the instances together so they're easy to test in isolation.
 */
final class WeAndMe_Headless_Plugin {

	private static ?self $instance = null;

	public WeAndMe_Headless_CPT $cpt;
	public WeAndMe_Headless_Meta $meta;
	public WeAndMe_Headless_Rest $rest;
	public WeAndMe_Headless_Revalidation $revalidation;
	public WeAndMe_Headless_Admin $admin;
	public WeAndMe_Headless_GraphQL $graphql;

	public static function instance(): self {
		if ( self::$instance === null ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		$this->cpt           = new WeAndMe_Headless_CPT();
		$this->meta          = new WeAndMe_Headless_Meta( $this->cpt );
		$this->rest          = new WeAndMe_Headless_Rest( $this->meta );
		$this->revalidation  = new WeAndMe_Headless_Revalidation();
		$this->admin         = new WeAndMe_Headless_Admin( $this->revalidation );
		// GraphQL is no-op until WPGraphQL is active; safe to instantiate.
		$this->graphql       = new WeAndMe_Headless_GraphQL( $this->cpt, $this->meta );

		$this->cpt->register();
		$this->meta->register();
		$this->rest->register();
		$this->revalidation->register();
		$this->admin->register();
		$this->graphql->register();
	}
}

add_action( 'plugins_loaded', static function (): void {
	WeAndMe_Headless_Plugin::instance();
} );

// Activation / deactivation: flush rewrite rules so the new CPT slugs
// (`/story/`, `/call/`, etc.) resolve without a manual permalink save.
register_activation_hook( __FILE__, static function (): void {
	( new WeAndMe_Headless_CPT() )->register();
	flush_rewrite_rules();
} );

register_deactivation_hook( __FILE__, static function (): void {
	flush_rewrite_rules();
} );
