<?php
namespace WPCoupons\Model;

class User {
	/**
	 * Registers the custom post type for Coupon.
	 */
	public static function register() {
		register_meta(
			'user',
			'wp_coupon',
			array(
				'type'         => 'object',
				'description'  => 'For each coupon group, it stores stats for popups and retrieved coupons',
				'single'       => true,
				'show_in_rest' => array(
					'schema' => array(
						'type'  => 'array',
						'items' => array(
							'type'       => 'object',
							'properties' => array(
								'group_id'         => array( 'type' => 'number' ),
								'number_of_popups' => array( 'type' => 'number' ),
								'last_popup_date'  => array( 'type' => 'string' ),
								'coupons'          => array(
									'type'  => 'array',
									'items' => array(
										'type'       => 'object',
										'properties' => array(
											'coupon_id'    => array( 'type' => 'number' ),
											'retrieved_at' => array( 'type' => 'string' ),
										),
									),
								),
							),
						),
					),
				),
			)
		);
	}
}
