<?php
namespace WPCoupons\Model;

class Coupon {
	/**
	 * Registers the custom post type for Coupon.
	 */
	public static function register() {
		register_post_type(
			'wp_coupon',
			array(
				'label'                 => 'Coupons',
				'public'                => false,
				'hierarchical'          => false,
				'supports'              => array( 'title', 'editor', 'custom-fields', 'page-attributes' ),
				'rewrite'               => false,
				'show_in_rest'          => true,
				'rest_base'             => 'wp_coupon',
				'rest_controller_class' => 'WP_REST_Posts_Controller',
			)
		);

		register_post_meta(
			'wp_coupon',
			'expires_at',
			array(
				'type'         => 'string',
				'description'  => 'Last day of coupon validity (in site\'s time-zone), stored in MySQL date format Y-m-d (e.g. 2020-12-24).',
				'single'       => true,
				'show_in_rest' => true,
			)
		);

		register_post_meta(
			'wp_coupon',
			'user_id',
			array(
				'type'         => 'number',
				'description'  => 'ID of user, who received the coupon.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);
	}
}
