<?php
/**
 * REST exposure: register each meta field so it appears in
 * /wp-json/wp/v2/{cpt}?{field}=... and `_fields` queries.
 *
 * This is what the Next.js frontend reads when fetching via fetch().
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

final class WeAndMe_Headless_Rest {

	public function __construct( private readonly WeAndMe_Headless_Meta $meta ) {}

	public function register(): void {
		add_action( 'rest_api_init', [ $this, 'register_fields' ] );
		// Allow `orderby=menu_order` for our non-hierarchical CPTs.
		// WordPress only whitelists it for pages (hierarchical).
		add_filter( 'rest_endpoints', [ $this, 'allow_menu_order_orderby' ] );
	}

	public function register_fields(): void {
		foreach ( WeAndMe_Headless_CPT::SCHEMA as $slug => $spec ) {
			foreach ( $spec['fields'] as $field => $def ) {
				$key = WeAndMe_Headless_CPT::meta_key( $slug, $field );
				register_rest_field( $slug, $field, [
					'get_callback' => static function ( $post_arr ) use ( $key, $def ) {
						$raw = get_post_meta( $post_arr['id'], $key, true );
						return self::cast( $raw, $def );
					},
					'update_callback' => static function ( $value, $post ) use ( $key, $def ) {
						$type = $def['type'] ?? 'string';
						if ( $type === 'boolean' ) {
							update_post_meta( $post->ID, $key, $value ? '1' : '0' );
						} elseif ( $type === 'integer' ) {
							update_post_meta( $post->ID, $key, (string) (int) $value );
						} elseif ( $type === 'number' ) {
							update_post_meta( $post->ID, $key, (string) (float) $value );
						} else {
							update_post_meta( $post->ID, $key, (string) $value );
						}
					},
					'schema' => self::schema_for( $field, $def ),
				] );
			}
		}
	}

	private static function cast( mixed $raw, array $def ): mixed {
		if ( $raw === '' || $raw === null ) {
			return null;
		}
		return match ( $def['type'] ) {
			'boolean' => (bool) $raw,
			'integer' => (int) $raw,
			'number'  => (float) $raw,
			default   => (string) $raw,
		};
	}

	private static function schema_for( string $field, array $def ): array {
		$schema = [
			'description' => $def['description'] ?? ucwords( str_replace( '_', ' ', $field ) ),
			'type'        => self::json_type( $def['type'] ),
		];
		if ( isset( $def['enum'] ) ) {
			$schema['enum'] = $def['enum'];
		}
		if ( isset( $def['format'] ) ) {
			$schema['format'] = $def['format'];
		}
		return $schema;
	}

	private static function json_type( string $type ): string {
		return match ( $type ) {
			'integer' => 'integer',
			'number'  => 'number',
			'boolean' => 'boolean',
			default   => 'string',
		};
	}

	/**
	 * The WordPress REST API only allows `menu_order` as an orderby
	 * value for hierarchical post types. Our 7 CPTs are non-hierarchical
	 * but use `menu_order` (which we expose as the `display_order` field)
	 * for editor-driven ordering. Loosen the check.
	 */
	public function allow_menu_order_orderby( array $endpoints ): array {
		foreach ( array_keys( WeAndMe_Headless_CPT::SCHEMA ) as $slug ) {
			$key = "/wp/v2/{$slug}";
			if ( ! isset( $endpoints[ $key ] ) ) {
				continue;
			}
			foreach ( $endpoints[ $key ] as $verb => $def ) {
				if ( isset( $def['args']['orderby']['enum'] ) ) {
					$enum = $def['args']['orderby']['enum'];
					if ( ! in_array( 'menu_order', $enum, true ) ) {
						$endpoints[ $key ][ $verb ]['args']['orderby']['enum'][] = 'menu_order';
					}
				}
			}
		}
		return $endpoints;
	}
}
