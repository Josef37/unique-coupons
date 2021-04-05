<?php

use WPCoupons\Models\Coupon;
use WPCoupons\Models\CouponGroup;

class CouponTest extends WP_UnitTestCase {
	private $coupons;
	private $coupons_data;
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

		$this->coupons_data = array(
			array(
				'value'      => 'Coupon1',
				'expires_at' => date( 'Y-m-d', strtotime( '+1 day' ) ),
				'status'     => 'publish',
				'group_id'   => $group_id,
			),
			array(
				'value'      => 'Coupon2',
				'expires_at' => date( 'Y-m-d', strtotime( '-1 day' ) ),
				'status'     => 'draft',
				'group_id'   => $group_id,
			),
			array(
				'value'      => 'Coupon3',
				'expires_at' => date( 'Y-m-d' ),
				'status'     => 'publish',
				'group_id'   => $group_id,
			),
		);

		$this->expectations = array(
			array(
				'valid'       => true,
				'active'      => true,
				'unused'      => true,
				'retrievable' => true,
			),
			array(
				'valid'       => false,
				'active'      => false,
				'unused'      => true,
				'retrievable' => false,
			),
			array(
				'valid'       => true,
				'active'      => true,
				'unused'      => true,
				'retrievable' => true,
			),
		);

		$this->coupons = array_map(
			function( $coupon_data ) {
				$coupon_id = Coupon::insert( $coupon_data );
				return new Coupon( $coupon_id );
			},
			$this->coupons_data
		);
	}

	public function test_get_and_insert() {
		foreach ( array_map( null, $this->coupons, $this->coupons_data ) as list( $coupon, $coupon_data ) ) {
			foreach ( $coupon_data as $key => $value ) {
				$this->assertEquals(
					$value,
					call_user_func( array( $coupon, "get_$key" ) )
				);
			}
		}
	}

	public function test_properties() {
		$properties = array_keys( $this->expectations[0] );
		foreach ( array_map( null, $this->coupons, $this->expectations ) as list( $coupon, $expect ) ) {
			foreach ( $properties as $property ) {
				$this->assertEquals(
					$expect[ $property ],
					call_user_func( array( $coupon, "is_$property" ) )
				);
			}
		}
	}
}
