<?php

use WPCoupons\Models\Coupon;
use WPCoupons\Models\CouponGroup;
use WPCoupons\Options;

class CouponTest extends WP_UnitTestCase {
	/** @var Coupon[] */
	private $coupons;
	/** @var array[] */
	private $coupons_data;
	/** @var array[] */
	private $expectations;

	public function setUp() {
		parent::setUp();

		$group_data = array(
			'name'        => 'Coupon Group',
			'description' => '',
			'template'    => '',
			'is_active'   => true,
		);
		$group_id   = CouponGroup::insert( $group_data );
		$user_id    = $this->factory->user->create();

		$last_usage_timestamp = time() + Options::get_seconds_valid_after_distribution();
		$this->coupons_data   = array(
			array(
				'value'      => 'Coupon1',
				'expires_at' => date( 'Y-m-d', $last_usage_timestamp ),
				'status'     => 'publish',
				'group_id'   => $group_id,
			),
			array(
				'value'      => 'Coupon2',
				'expires_at' => date( 'Y-m-d', strtotime( '-1 day', $last_usage_timestamp ) ),
				'status'     => 'trash',
				'group_id'   => $group_id,
			),
			array(
				'value'      => 'Coupon3',
				'expires_at' => date( 'Y-m-d' ),
				'status'     => 'publish',
				'group_id'   => $group_id,
			),
			array(
				'value'      => 'Coupon4',
				'expires_at' => date( 'Y-m-d', strtotime( '-1 day' ) ),
				'status'     => 'publish',
				'group_id'   => $group_id,
			),
			array(
				'value'      => 'Coupon5',
				'expires_at' => date( 'Y-m-d', $last_usage_timestamp ),
				'status'     => 'publish',
				'group_id'   => $group_id,
				'user_id'    => $user_id,
			),
		);

		$this->expectations = array(
			array(
				'is_distributable'          => true,
				'is_active'                 => true,
				'is_unused'                 => true,
				'is_valid_for_distribution' => true,
				'is_valid'                  => true,
				'get_status'                => 'active',
			),
			array(
				'is_distributable'          => false,
				'is_active'                 => false,
				'is_unused'                 => true,
				'is_valid_for_distribution' => false,
				'is_valid'                  => true,
				'get_status'                => 'expired',
			),
			array(
				'is_distributable'          => false,
				'is_active'                 => true,
				'is_unused'                 => true,
				'is_valid_for_distribution' => false,
				'is_valid'                  => true,
				'get_status'                => 'expired',
			),
			array(
				'is_distributable'          => false,
				'is_active'                 => true,
				'is_unused'                 => true,
				'is_valid_for_distribution' => false,
				'is_valid'                  => false,
				'get_status'                => 'expired',
			),
			array(
				'is_distributable'          => false,
				'is_active'                 => true,
				'is_unused'                 => false,
				'is_valid_for_distribution' => true,
				'is_valid'                  => true,
				'get_status'                => 'used',
			),
		);

		$this->coupons = array_map(
			function( $coupon_data ) {
				$coupon_id = Coupon::insert( $coupon_data );
				$coupon    = new Coupon( $coupon_id );
				if ( isset( $coupon_data['user_id'] ) ) {
					$coupon->set_user_id( $coupon_data['user_id'] );
				}
				return $coupon;
			},
			$this->coupons_data
		);
	}

	public function test_properties() {
		foreach ( array_map( null, $this->coupons, $this->expectations ) as list( $coupon, $expectation ) ) {
			foreach ( $expectation as $property => $value ) {
				$this->assertEquals(
					$value,
					call_user_func( array( $coupon, $property ) ),
					sprintf( 'Expected "%s" to be "%s" for coupon "%s".', $property, $expectation[ $property ], $coupon->get_value() )
				);
			}
		}
	}

	public function test_set_user_id() {
		$user_id = 123;
		foreach ( $this->coupons as $coupon ) {
			$coupon->set_user_id( $user_id );

			$this->assertEquals(
				$user_id,
				$coupon->get_user_id()
			);
		}
	}
}
