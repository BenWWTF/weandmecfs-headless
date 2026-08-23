<?php
/**
 * Custom Post Type registry.
 *
 * Each CPT is described as an array. The order in the array drives the
 * "Add New" menu order in wp-admin. Keep the keys stable — the Next.js
 * frontend keys GraphQL/REST responses off `slug` and the meta key prefix.
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

final class WeAndMe_Headless_CPT {

	/**
	 * Single source of truth for the schema. Adding a field here also adds
	 * it to the REST exposure (in {@see WeAndMe_Headless_Meta}) and to the
	 * GraphQL schema (in {@see WeAndMe_Headless_GraphQL}).
	 */
	public const SCHEMA = [
		'call' => [
			'singular'      => 'Funding Call',
			'plural'        => 'Funding Calls',
			'menu_position' => 5,
			'menu_icon'     => 'dashicons-megaphone',
			'menu_label'    => 'Calls',
			'public'        => true,
			'has_archive'   => true,
			'supports'      => [ 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ],
			'fields'        => [
				'status'        => [ 'type' => 'string',  'enum' => [ 'open', 'upcoming', 'closed' ], 'default' => 'open' ],
				'amount_total'  => [ 'type' => 'number',  'description' => 'Total funding pool in EUR' ],
				'deadline'      => [ 'type' => 'string',  'format' => 'date' ],
				'external_url'  => [ 'type' => 'string',  'format' => 'uri' ],
				'display_order' => [ 'type' => 'integer', 'default' => 0 ],
				'featured'      => [ 'type' => 'boolean', 'default' => false ],
			],
		],

		'project' => [
			'singular'      => 'Funded Project',
			'plural'        => 'Funded Projects',
			'menu_position' => 6,
			'menu_icon'     => 'dashicons-portfolio',
			'menu_label'    => 'Funded Projects',
			'public'        => true,
			'has_archive'   => true,
			'supports'      => [ 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ],
			'fields'        => [
				'institution'    => [ 'type' => 'string' ],
				'amount'         => [ 'type' => 'number',  'description' => 'Awarded amount in EUR' ],
				'year'           => [ 'type' => 'integer' ],
				'call_id'        => [ 'type' => 'integer', 'relation' => 'call' ],
				'lead_team_id'   => [ 'type' => 'integer', 'relation' => 'team' ],
				'external_url'   => [ 'type' => 'string',  'format' => 'uri' ],
				'display_order'  => [ 'type' => 'integer', 'default' => 0 ],
			],
		],

		'story' => [
			'singular'      => 'Patient Story',
			'plural'        => 'Patient Stories',
			'menu_position' => 7,
			'menu_icon'     => 'dashicons-format-quote',
			'menu_label'    => 'Stories',
			'public'        => true,
			'has_archive'   => true,
			'supports'      => [ 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ],
			'fields'        => [
				'age'             => [ 'type' => 'integer' ],
				'location'        => [ 'type' => 'string' ],
				'onset_year'      => [ 'type' => 'integer' ],
				'short_bio'       => [ 'type' => 'string',  'description' => 'One-sentence card blurb' ],
				'long_story_url'  => [ 'type' => 'string',  'format' => 'uri' ],
				'photographer'    => [ 'type' => 'string' ],
				'display_order'   => [ 'type' => 'integer', 'default' => 0 ],
				'featured'        => [ 'type' => 'boolean', 'default' => false ],
			],
		],

		'team' => [
			'singular'      => 'Team Member',
			'plural'        => 'Team & Advisory Board',
			'menu_position' => 8,
			'menu_icon'     => 'dashicons-groups',
			'menu_label'    => 'Team & Board',
			'public'        => true,
			'has_archive'   => false,
			'supports'      => [ 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ],
			'fields'        => [
				'role'          => [ 'type' => 'string' ],
				'role_type'     => [ 'type' => 'string', 'enum' => [ 'board', 'team', 'scientific', 'medical', 'patient', 'advisory', 'jury', 'alumni' ], 'default' => 'team' ],
				'x_handle'      => [ 'type' => 'string' ],
				'linkedin_url'  => [ 'type' => 'string', 'format' => 'uri' ],
				'display_order' => [ 'type' => 'integer', 'default' => 0 ],
			],
		],

		'partner' => [
			'singular'      => 'Partner',
			'plural'        => 'Partners',
			'menu_position' => 9,
			'menu_icon'     => 'dashicons-networking',
			'menu_label'    => 'Partners',
			'public'        => true,
			'has_archive'   => false,
			'supports'      => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
			'fields'        => [
				'partner_type'   => [ 'type' => 'string', 'enum' => [ 'process', 'jury', 'funder', 'awareness', 'other' ], 'default' => 'other' ],
				'external_url'   => [ 'type' => 'string', 'format' => 'uri' ],
				'display_order'  => [ 'type' => 'integer', 'default' => 0 ],
			],
		],

		'event' => [
			'singular'      => 'Event',
			'plural'        => 'Events',
			'menu_position' => 10,
			'menu_icon'     => 'dashicons-calendar-alt',
			'menu_label'    => 'Events',
			'public'        => true,
			'has_archive'   => true,
			'supports'      => [ 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ],
			'fields'        => [
				'start_date'    => [ 'type' => 'string', 'format' => 'date-time' ],
				'end_date'      => [ 'type' => 'string', 'format' => 'date-time' ],
				'location'      => [ 'type' => 'string' ],
				'external_url'  => [ 'type' => 'string', 'format' => 'uri' ],
				'is_featured'   => [ 'type' => 'boolean', 'default' => false ],
				'display_order' => [ 'type' => 'integer', 'default' => 0 ],
			],
		],

		'guardian' => [
			'singular'      => 'Guardian',
			'plural'        => 'Guardians',
			'menu_position' => 11,
			'menu_icon'     => 'dashicons-heart',
			'menu_label'    => 'Guardians',
			'public'        => true,
			'has_archive'   => false,
			'supports'      => [ 'title', 'editor', 'thumbnail', 'custom-fields' ],
			'fields'        => [
				'quote'         => [ 'type' => 'string' ],
				'since'         => [ 'type' => 'integer', 'description' => 'Year they became a Guardian' ],
				'external_url'  => [ 'type' => 'string', 'format' => 'uri' ],
				'display_order' => [ 'type' => 'integer', 'default' => 0 ],
			],
		],
	];

	/**
	 * Field name → meta_key. The `wm_` prefix is the only namespace that
	 * the plugin owns; everything else on a post is fair game.
	 */
	public static function meta_key( string $cpt_slug, string $field ): string {
		return "wm_{$cpt_slug}_{$field}";
	}

	public function register(): void {
		foreach ( self::SCHEMA as $slug => $spec ) {
			add_action( 'init', static function () use ( $slug, $spec ): void {
				self::register_one( $slug, $spec );
			} );
		}
	}

	private static function register_one( string $slug, array $spec ): void {
		$labels = [
			'name'               => $spec['plural'],
			'singular_name'      => $spec['singular'],
			'menu_name'          => $spec['menu_label'],
			'add_new_item'       => "Add New {$spec['singular']}",
			'edit_item'          => "Edit {$spec['singular']}",
			'all_items'          => $spec['plural'],
			'view_item'          => "View {$spec['singular']}",
			'search_items'       => "Search {$spec['plural']}",
			'not_found'          => "No {$spec['plural']} found",
			'not_found_in_trash' => "No {$spec['plural']} found in trash",
		];

		register_post_type( $slug, [
			'labels'              => $labels,
			'public'              => $spec['public'],
			'has_archive'         => $spec['has_archive'],
			'show_in_rest'        => true,                  // expose in WP REST API
			'rest_base'           => $slug,                 // /wp-json/wp/v2/{slug}
			'rest_controller_class' => 'WP_REST_Posts_Controller',
			'menu_icon'           => $spec['menu_icon'],
			'menu_position'       => $spec['menu_position'],
			'supports'            => $spec['supports'],
			'rewrite'             => [ 'slug' => $slug, 'with_front' => false ],
		] );
	}
}
