<?php
namespace WPCoupons\Models;

class CouponGroup {
	public static $taxonomy_key = 'wp_coupon_group';

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
		return get_term( $this->group_id, self::$taxonomy_key )->name;
	}
	public function get_description() {
		return get_term( $this->group_id, self::$taxonomy_key )->description;
	}
	public function get_template() {
		return get_term_meta( $this->group_id, 'template', true );
	}
	public function get_is_active() {
		return get_term_meta( $this->group_id, 'is_active', true );
	}

	/**
	 * Checks if a group exists with the given ID.
	 */
	public static function exists( $group_id ) {
		$group_term = get_term( $group_id, self::$taxonomy_key );
		return isset( $group_term ) && ! is_wp_error( $group_term );
	}

	/**
	 * Registers the custom taxonomy for CouponGroups.
	 */
	public static function register() {
		register_taxonomy(
			self::$taxonomy_key,
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
				'rest_base'             => self::$taxonomy_key,
				'rest_controller_class' => 'WP_REST_Terms_Controller',
			)
		);

		register_term_meta(
			self::$taxonomy_key,
			'template',
			array(
				'type'         => 'string',
				'description'  => 'The template to use for offering users coupons from this group.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);

		register_term_meta(
			self::$taxonomy_key,
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
