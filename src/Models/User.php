<?php
namespace WPCoupons\Models;

class User {
	public $user_id;

	public function __construct( $user_id = null ) {
		$this->user_id = $user_id ?? get_current_user_id();
	}

	public function can_receive_coupons() {
		return $this->is_eligible_for_coupons()
			&& ! $this->has_opted_out_from_coupons()
			&& ! $this->time_since_last_popup_too_close();
	}

	public function is_eligible_for_coupons() {
		return apply_filters( 'wp_coupons_user_is_eligible', true, $this->user_id );
	}

	/** @todo add field to user meta */
	public function has_opted_out_from_coupons() {
		return false;
	}

	/** @todo get time delta from options */
	public function time_since_last_popup_too_close() {
		return false;
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
