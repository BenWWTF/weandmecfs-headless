<?php
/**
 * Meta boxes + field registration for the headless CPTs.
 *
 * For session 1 we keep things simple: native meta boxes, no ACF Pro
 * dependency. The shape of every field is owned by {@see WeAndMe_Headless_CPT::SCHEMA}
 * so that the REST and GraphQL layers can read the same source.
 *
 * @package WeAndMeHeadless
 */

declare(strict_types=1);

defined( 'ABSPATH' ) || exit;

final class WeAndMe_Headless_Meta {

	public function __construct( private readonly WeAndMe_Headless_CPT $cpt ) {}

	public function register(): void {
		add_action( 'add_meta_boxes', [ $this, 'add_boxes' ] );
		add_action( 'save_post', [ $this, 'save' ], 10, 2 );
	}

	/**
	 * One meta box per CPT, sitting below the editor. The box renders the
	 * schema-driven form, which keeps the editor experience consistent.
	 */
	public function add_boxes(): void {
		foreach ( WeAndMe_Headless_CPT::SCHEMA as $slug => $spec ) {
			add_meta_box(
				"wm_{$slug}_details",
				"{$spec['singular']} details",
				[ $this, 'render_box' ],
				$slug,
				'normal',
				'high',
				[ 'cpt' => $slug ]
			);
		}
	}

	public function render_box( \WP_Post $post, array $box ): void {
		$slug = $box['args']['cpt'];
		$spec = WeAndMe_Headless_CPT::SCHEMA[ $slug ];

		wp_nonce_field( "wm_save_{$slug}", "wm_nonce_{$slug}" );

		echo '<table class="form-table" role="presentation"><tbody>';

		foreach ( $spec['fields'] as $field => $def ) {
			$key   = WeAndMe_Headless_CPT::meta_key( $slug, $field );
			$value = get_post_meta( $post->ID, $key, true );
			$value = $value === '' && isset( $def['default'] ) ? $def['default'] : $value;

			echo '<tr>';
			printf(
				'<th scope="row"><label for="%1$s">%2$s</label></th>',
				esc_attr( $key ),
				esc_html( self::label( $field ) )
			);
			echo '<td>';
			echo $this->input( $key, $def, $value, $slug ); // phpcs:ignore WordPress.Security.EscapeOutput
			echo '</td></tr>';
		}

		echo '</tbody></table>';
	}

	private function input( string $name, array $def, mixed $value, string $cpt ): string {
		$id   = esc_attr( $name );
		$val  = esc_attr( (string) $value );
		$type = $def['type'] ?? 'string';

		// Enum → select.
		if ( isset( $def['enum'] ) ) {
			$html = "<select id=\"{$id}\" name=\"{$name}\" class=\"regular-text\">";
			foreach ( $def['enum'] as $option ) {
				$selected = selected( $value, $option, false );
				$html    .= sprintf(
					'<option value="%1$s" %2$s>%1$s</option>',
					esc_attr( $option ),
					$selected
				);
			}
			$html .= '</select>';
			return $html;
		}

		// Relation → dropdown of the related CPT.
		if ( isset( $def['relation'] ) ) {
			$related = $def['relation'];
			$posts   = get_posts( [
				'post_type'      => $related,
				'posts_per_page' => -1,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'post_status'    => 'publish',
			] );
			$html  = "<select id=\"{$id}\" name=\"{$name}\" class=\"regular-text\">";
			$html .= '<option value="">— none —</option>';
			foreach ( $posts as $p ) {
				$selected = selected( (int) $value, $p->ID, false );
				$html    .= sprintf(
					'<option value="%1$d" %2$s>%3$s</option>',
					$p->ID,
					$selected,
					esc_html( $p->post_title )
				);
			}
			$html .= '</select>';
			return $html;
		}

		// Boolean → checkbox.
		if ( $type === 'boolean' ) {
			$checked = checked( $value, '1', false );
			return "<label><input type=\"checkbox\" id=\"{$id}\" name=\"{$name}\" value=\"1\" {$checked}/> yes</label>";
		}

		// Long text → textarea.
		if ( $type === 'string' && in_array( $name, [ 'wm_story_short_bio', 'wm_guardian_quote' ], true ) ) {
			return "<textarea id=\"{$id}\" name=\"{$name}\" rows=\"4\" class=\"large-text\">{$val}</textarea>";
		}

		// Date / datetime → HTML5 input.
		if ( isset( $def['format'] ) && str_contains( (string) $def['format'], 'date' ) ) {
			$input_type = $def['format'] === 'date-time' ? 'datetime-local' : 'date';
			return "<input type=\"{$input_type}\" id=\"{$id}\" name=\"{$name}\" value=\"{$val}\" class=\"regular-text\"/>";
		}

		// Default: single-line text or number.
		$input_type = $type === 'integer' || $type === 'number' ? 'number' : 'text';
		return "<input type=\"{$input_type}\" id=\"{$id}\" name=\"{$name}\" value=\"{$val}\" class=\"regular-text\"/>";
	}

	public function save( int $post_id, \WP_Post $post ): void {
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		if ( ! isset( WeAndMe_Headless_CPT::SCHEMA[ $post->post_type ] ) ) {
			return;
		}

		$slug   = $post->post_type;
		$nonce  = $_POST[ "wm_nonce_{$slug}" ] ?? '';
		if ( ! wp_verify_nonce( (string) $nonce, "wm_save_{$slug}" ) ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		foreach ( WeAndMe_Headless_CPT::SCHEMA[ $slug ]['fields'] as $field => $def ) {
			$key = WeAndMe_Headless_CPT::meta_key( $slug, $field );
			if ( ! isset( $_POST[ $key ] ) ) {
				// Boolean unchecked → explicit zero.
				if ( $def['type'] === 'boolean' ) {
					update_post_meta( $post_id, $key, '0' );
				}
				continue;
			}
			$raw  = wp_unslash( $_POST[ $key ] );
			$type = $def['type'];

			if ( $type === 'boolean' ) {
				$clean = '1';
			} elseif ( $type === 'integer' ) {
				$clean = (string) max( 0, (int) $raw );
			} elseif ( $type === 'number' ) {
				$clean = (string) (float) $raw;
			} else {
				$clean = sanitize_text_field( (string) $raw );
			}
			update_post_meta( $post_id, $key, $clean );
		}
	}

	private static function label( string $field ): string {
		// age → Age, short_bio → Short bio
		$out = str_replace( '_', ' ', $field );
		return ucwords( $out );
	}
}
