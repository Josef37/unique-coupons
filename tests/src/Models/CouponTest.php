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
				'status'     => 'draft',
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
				'distributable'          => true,
				'active'                 => true,
				'unused'                 => true,
				'valid_for_distribution' => true,
				'valid'                  => true,
			),
			array(
				'distributable'          => false,
				'active'                 => false,
				'unused'                 => true,
				'valid_for_distribution' => false,
				'valid'                  => true,
			),
			array(
				'distributable'          => false,
				'active'                 => true,
				'unused'                 => true,
				'valid_for_distribution' => false,
				'valid'                  => true,
			),
			array(
				'distributable'          => false,
				'active'                 => true,
				'unused'                 => true,
				'valid_for_distribution' => false,
				'valid'                  => false,
			),
			array(
				'distributable'          => false,
				'active'                 => true,
				'unused'                 => false,
				'valid_for_distribution' => true,
				'valid'                  => true,
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
					call_user_func( array( $coupon, "is_$property" ) ),
					sprintf( 'Expected %s to be %s for coupon %s.', $property, $expect[ $property ] ? 'true' : 'false', $coupon->get_value() )
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
