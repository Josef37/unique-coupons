<?php
namespace WPCoupons\Models;

class CouponGroup {
	const TAXONOMY_KEY    = 'wp_coupon_group';
	const TERM_QUERY_ARGS = array(
		'taxonomy'   => self::TAXONOMY_KEY,
		'orderby'    => 'term_id',
		'fields'     => 'ids',
		'hide_empty' => false,
	);

	public $group_id;

	public function __construct( $group_id ) {
		$this->group_id = $group_id;
	}

	/** @todo maybe move to Popup service provider */
	public function echo_popup() {
		echo '<div class="wp-coupon-popup" style="display: none; position: fixed; position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); background: lightgreen; border: 3px solid black; padding: 3rem; font-size: 5rem; max-height: 80%; overflow: scroll;">'
			. wp_kses_post( $this->get_template() )
			. '</div>';
	}

	public function get_name() {
		return get_term( $this->group_id, self::TAXONOMY_KEY )->name;
	}
	public function get_description() {
		return get_term( $this->group_id, self::TAXONOMY_KEY )->description;
	}
	public function get_template() {
		return get_term_meta( $this->group_id, 'template', true );
	}
	public function get_is_active() {
		return get_term_meta( $this->group_id, 'is_active', true );
	}

	public static function get_active_group_ids() {
		return get_terms(
			array_merge(
				self::TERM_QUERY_ARGS,
				array(
					'meta_key'   => 'is_active',
					'meta_value' => true,
				)
			)
		);
	}

	public static function exists( $group_id ) {
		$group_term = get_term( $group_id, self::TAXONOMY_KEY );
		return isset( $group_term ) && ! is_wp_error( $group_term );
	}

	public static function insert( $values ) {
		list(
			'name' => $name,
			'description' => $description,
			'template' => $template,
			'is_active' => $is_active
		) = $values;

		$term     = wp_insert_term(
			$name,
			self::TAXONOMY_KEY,
			array( 'description' => $description )
		);
		$group_id = $term['term_id'];
		add_term_meta( $group_id, 'template', $template, true );
		add_term_meta( $group_id, 'is_active', $is_active, true );

		return $group_id;
	}

	/**
	 * Registers the custom taxonomy for CouponGroups.
	 */
	public static function register() {
		register_taxonomy(
			self::TAXONOMY_KEY,
			array( 'wp_coupon' ),
			array(
				'hierarchical'          => false,
				'public'                => false,
				'query_var'             => false,
				'rewrite'               => false,
				'capabilities'          => array(
					'manage_terms' => 'edit_posts',
					'edit_terms'   => 'edit_posts',
					'delete_terms' => 'edit_posts',
					'assign_terms' => 'edit_posts',
				),
				'labels'                => array(
					'name' => __( 'Coupon Groups', 'wp-coupons' ),
				),
				'show_in_rest'          => true,
				'rest_base'             => self::TAXONOMY_KEY,
				'rest_controller_class' => 'WP_REST_Terms_Controller',
			)
		);

		register_term_meta(
			self::TAXONOMY_KEY,
			'template',
			array(
				'type'         => 'string',
				'description'  => 'The template to use for offering users coupons from this group.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);

		register_term_meta(
			self::TAXONOMY_KEY,
			'is_active',
			array(
				'type'         => 'boolean',
				'description'  => 'Shows if coupons from this group get shown to users.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);
	}
}
