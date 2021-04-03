<?php

use WPCoupons\Models\CouponGroup;

class CouponGroupTest extends \WP_UnitTestCase {
	public static $group;
	public static $values = array(
		'name'        => 'Coupon Group',
		'description' => 'Group Description',
		'template'    => 'My Template',
		'is_active'   => 'true',
	);

	public static function setUpBeforeClass() {
		self::$group = CouponGroup::create( self::$values );
	}

	public function test_get_and_create() {
		foreach ( self::$values as $key => $value ) {
			$this->assertEquals(
				$value,
				call_user_func( array( self::$group, "get_$key" ) )
			);
		}
	}

	public function test_exists() {
		$group_id = self::$group->group_id;
		$this->assertTrue( CouponGroup::exists( $group_id ) );
		$this->assertFalse( CouponGroup::exists( $group_id + 1 ) );
		$this->assertFalse( CouponGroup::exists( 0 ) );
	}
}
