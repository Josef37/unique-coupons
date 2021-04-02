<?php
namespace WPCoupons\Models;

class User {
	public function __construct( $user_id ) {
		$this->user_id = $user_id;
	}

	/** @todo */
	public function recall_latest_coupon_id() {
		throw new \BadMethodCallException( 'Not implemented' );
	}

	/**
	 * Registers the custom post type for Coupon.
	 *
	 * Example meta entry:
	 *  [
	 *      'group_id' => 123,
	 *      'number_of_popups' => 2,
	 *      'last_popup_date' => 2021-03-12,
	 *      'coupons' => [
	 *          'coupon_id' => 432,
	 *          'retrieved_at' => 2021-02-27,
	 *      ]
	 *  ]
	 */
	public static function register() {
		register_meta(
			'user',
			'wp_coupon',
			array(
				'type'         => 'array',
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
