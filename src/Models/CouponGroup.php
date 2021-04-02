<?php
namespace WPCoupons\Models;

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

	/**
	 * @param int $group_id Term ID of the group to get.
	 * @throws \Exception
	 * @return \WP_Term
	 */
	public static function get( $group_id ) {
		$group_term = get_term( $group_id, 'wp_coupon_group' );
		if ( is_wp_error( $group_term ) ) {
			throw new \Exception( $group_term->get_error_message() );
		} elseif ( empty( $group_term ) ) {
			throw new \Exception( "Failed to get coupon group with ID {$group_id}" );
		}
		return $group_term;
	}

	/**
	 * Checks if a group exists with the given ID.
	 */
	public static function exists( $group_id ) {
		try {
			self::get( $group_id );
		} catch ( \Exception $ex ) {
			return false;
		}
		return true;
	}
}
