<?php
namespace WPCoupons\Model;

class CouponGroup {
	/**
	 * Registers the custom taxonomy for CouponGroups.
	 */
	public static function register() {
		register_taxonomy(
			'wp_coupon_group',
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
				'rest_base'             => 'wp_coupon_group',
				'rest_controller_class' => 'WP_REST_Terms_Controller',
			)
		);

		register_term_meta(
			'wp_coupon_group',
			'template',
			array(
				'type'         => 'string',
				'description'  => 'The template to use for offering users coupons from this group.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);

		register_term_meta(
			'wp_coupon_group',
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
