<?php
/**
 * GraphQL schema extensions — no-op unless WPGraphQL is active.
 *
 * Session 1 uses the REST endpoint, but the schema definitions live here
 * so we can flip the switch in session 2 without touching the CPT layer.
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

final class WeAndMe_Headless_GraphQL {

	public function __construct(
		private readonly WeAndMe_Headless_CPT $cpt,
		private readonly WeAndMe_Headless_Meta $meta
	) {}

	public function register(): void {
		add_action( 'graphql_register_types', [ $this, 'register_types' ] );
	}

	public function register_types(): void {
		// If WPGraphQL isn't active, bail.
		if ( ! function_exists( 'register_graphql_object_type' ) ) {
			return;
		}

		// Register each CPT as a GraphQL type so editors (and the next.js
		// client) get a typed schema. Field names mirror the schema in
		// WeAndMe_Headless_CPT::SCHEMA so REST and GraphQL stay in sync.
		foreach ( WeAndMe_Headless_CPT::SCHEMA as $slug => $spec ) {
			$type_name = self::type_name( $slug );

			$fields = [];
			foreach ( $spec['fields'] as $field => $def ) {
				$fields[ $field ] = [
					'type'        => self::graphql_type( $def['type'] ),
					'description' => $def['description'] ?? $field,
				];
				if ( isset( $def['enum'] ) ) {
					$fields[ $field ]['type'] = 'String'; // enum registration needs a separate Type
				}
			}

			register_graphql_object_type( $type_name, [
				'description' => $spec['singular'],
				'fields'      => $fields,
			] );

			register_graphql_field( 'RootQueryTo' . ucfirst( $slug ) . 'Connection', 'edges', [
				'type' => [ 'list_of' => $type_name ],
			] );
		}
	}

	private static function type_name( string $slug ): string {
		// story → Story, funded-project → FundedProject
		$out = str_replace( '-', ' ', $slug );
		$out = str_replace( '_', ' ', $out );
		$out = ucwords( $out );
		return preg_replace( '/\s+/', '', $out );
	}

	private static function graphql_type( string $wp_type ): string {
		return match ( $wp_type ) {
			'boolean' => 'Boolean',
			'integer' => 'Int',
			'number'  => 'Float',
			default   => 'String',
		};
	}
}
