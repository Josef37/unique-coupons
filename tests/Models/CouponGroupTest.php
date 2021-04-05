<?php

use WPCoupons\Models\CouponGroup;

class CouponGroupTest extends \WP_UnitTestCase {
	private $group;
	private $data = array(
		'name'        => 'Coupon Group',
		'description' => 'Group Description',
		'template'    => 'My Template',
		'is_active'   => true,
	);

	public function setUp() {
		parent::setUp();

		$group_id    = CouponGroup::insert( $this->data );
		$this->group = new CouponGroup( $group_id );

		$inactive_data = array(
			'name'        => 'Inactive Coupon Group',
			'description' => '',
			'template'    => '',
			'is_active'   => false,
		);
		CouponGroup::insert( $inactive_data );
	}

	public function test_get_and_insert() {
		foreach ( $this->data as $key => $value ) {
			$this->assertEquals(
				$value,
				call_user_func( array( $this->group, "get_$key" ) )
			);
		}
	}

	public function test_exists() {
		$group_id = $this->group->group_id;
		$this->assertTrue( CouponGroup::exists( $group_id ) );
		$this->assertFalse( CouponGroup::exists( PHP_INT_MAX ) );
		$this->assertFalse( CouponGroup::exists( 0 ) );
	}

	public function test_get_active_group_ids() {
		$this->assertEquals(
			array( $this->group->group_id ),
			CouponGroup::get_active_group_ids()
		);
	}
}
