<?php

use WPCoupons\Models\User;

class UserTest extends WP_UnitTestCase {
	public function test_is_eligible_for_coupons() {
		$is_eligible_for_coupons = function ( $is_eligible, $user_id ) {
			return $user_id > 0;
		};
		add_filter( 'wp_coupons_user_is_eligible', $is_eligible_for_coupons, 10, 2 );

		foreach ( array( 0, 1 ) as $user_id ) {
			$user = new User( $user_id );
			$this->assertEquals( $user->is_eligible_for_coupons(), $is_eligible_for_coupons( true, $user_id ) );
		}
	}
}
