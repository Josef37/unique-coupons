<?php

use UniqueCoupons\Models\Coupon;
use UniqueCoupons\Models\CouponGroup;
use UniqueCoupons\Models\User;

class CouponGroupTest extends \WP_UnitTestCase {
	/** @var CouponGroup[] */
	private $groups;
	/** @var array */
	private $groups_data = array(
		array(
			'name'        => 'Coupon Group',
			'description' => 'Group Description',
			'template'    => 'My Template',
			'is_active'   => true,
		),
		array(
			'name'        => 'Inactive Coupon Group',
			'description' => '',
			'template'    => '',
			'is_active'   => false,
		),
	);

	public function setUp() {
		parent::setUp();

		$this->groups = array_map(
			function( $data ) {
				$group_id = CouponGroup::insert( $data );
				return new CouponGroup( $group_id );
			},
			$this->groups_data
		);
	}

	public function test_template_with_shortcode() {
		$shortcode_value = 'Hello World!';
		add_shortcode(
			'shortcode',
			function() use ( $shortcode_value ) {
				return $shortcode_value;
			}
		);

		$group_id = CouponGroup::insert(
			array(
				'name'        => 'Coupon Group with Shortcode',
				'description' => '',
				'template'    => 'Shortcode: [shortcode]',
				'is_active'   => true,
			)
		);
		$group    = new CouponGroup( $group_id );

		ob_start();
		$group->echo_popup();
		$popup_content = ob_get_clean();

		$this->assertStringContainsString(
			$shortcode_value,
			$popup_content
		);
	}

	public function test_get_and_insert() {
		foreach ( array_map( null, $this->groups, $this->groups_data ) as list($group, $data) ) {
			foreach ( $data as $key => $value ) {
				$this->assertEquals(
					$value,
					call_user_func( array( $group, "get_$key" ) )
				);
			}
		}
	}

	public function test_locks() {
		$group = $this->groups[0];
		$users = array( new User( 123 ), new User( 234 ) );

		$group->lock_coupon_for( $users[0] );
		$this->assertEquals( $group->get_number_of_locks(), 1 );

		$group->lock_coupon_for( $users[0] );
		$this->assertEquals( $group->get_number_of_locks(), 1 );

		$group->lock_coupon_for( $users[1] );
		$this->assertEquals( $group->get_number_of_locks(), 2 );

		$group->release_lock_for( $users[0] );
		$this->assertEquals( $group->get_number_of_locks(), 1 );

		$group->release_lock_for( $users[1] );
		$this->assertEquals( $group->get_number_of_locks(), 0 );
	}

	public function test_exists() {
		foreach ( $this->groups as $group ) {
			$this->assertTrue( CouponGroup::exists( $group->group_id ) );
		}
		$this->assertFalse( CouponGroup::exists( PHP_INT_MAX ) );
		$this->assertFalse( CouponGroup::exists( 0 ) );
		$this->assertFalse( CouponGroup::exists( -1 ) );
	}

	public function test_get_active_groups() {
		$this->assertEquals(
			array( $this->groups[0] ),
			CouponGroup::get_active_groups()
		);
	}

	public function test_get_coupons() {
		$coupon_data = array(
			'value'      => 'Coupon1',
			'expires_at' => time(),
			'status'     => 'publish',
			'group_id'   => $this->groups[0]->group_id,
		);
		$coupon_ids  = $this->insert_coupons( $coupon_data, 3 );

		$coupon_data['group_id'] = $this->groups[1]->group_id;
		$this->insert_coupons( $coupon_data, 3 );

		$this->assertArrayEquals(
			$coupon_ids,
			array_column( $this->groups[0]->get_coupons(), 'coupon_id' )
		);
	}

	/** @todo export to test helper */
	private function insert_coupons( $coupon_data, $count ) {
		return array_map(
			function() use ( $coupon_data ) {
				return Coupon::insert( $coupon_data );
			},
			range( 1, $count )
		);
	}

	/** @todo export to test helper */
	protected function assertArrayEquals( $expected, $actual, $message = '' ) {
		$this->assertEquals(
			array_diff( $expected, $actual ),
			array_diff( $actual, $expected ),
			$message
		);
	}
}
