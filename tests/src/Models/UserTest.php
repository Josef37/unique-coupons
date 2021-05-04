<?php

use WPCoupons\Models\Coupon;
use WPCoupons\Models\User;

class UserTest extends WP_UnitTestCase {
	public function test_is_authorized_for_coupons() {
		$is_authorized_for_coupons = function ( $is_authorized, $user_id ) {
			return $user_id >= 2;
		};
		add_filter( 'wp_coupons_user_is_authorized_for_coupons', $is_authorized_for_coupons, 10, 2 );

		$this->assertEquals( ( new User( 0 ) )->is_authorized_for_coupons(), false );
		$this->assertEquals( ( new User( 1 ) )->is_authorized_for_coupons(), false );
		$this->assertEquals( ( new User( 2 ) )->is_authorized_for_coupons(), true );
	}

	public function test_has_recent_retrieval() {
		$wp_user_id = $this->factory->user->create();
		$user       = new User( $wp_user_id );

		$this->assertFalse( $user->has_recent_retrieval() );

		$retrieval = array(
			'coupon_id' => 321,
			'group_id'  => 123,
			'timestamp' => time(),
		);
		$user->record_retrieval( $retrieval );

		$this->assertTrue( $user->has_recent_retrieval() );
	}

	public function test_record_retrieval() {
		$wp_user_id = $this->factory->user->create();
		$user       = new User( $wp_user_id );

		$group_id   = 123;
		$retrievals = array(
			array(
				'coupon_id' => 1,
				'group_id'  => $group_id,
				'timestamp' => 0,
			),
			array(
				'coupon_id' => 2,
				'group_id'  => $group_id,
				'timestamp' => 1,
			),
		);

		$user->record_retrieval( $retrievals[0] );

		$this->assertEquals(
			$user->get_retrievals(),
			array(
				array(
					'coupon_id'    => $retrievals[0]['coupon_id'],
					'retrieved_at' => $retrievals[0]['timestamp'],
				),
			)
		);
		$this->assertEquals(
			$user->get_groups_data(),
			array(
				array(
					'group_id'                 => $group_id,
					'last_retrieval_timestamp' => $retrievals[0]['timestamp'],
				),
			)
		);
		$this->assertEquals(
			( new Coupon( $retrievals[0]['coupon_id'] ) )->get_user_id(),
			$wp_user_id
		);

		$user->record_retrieval( $retrievals[1] );

		$this->assertEquals(
			$user->get_retrievals(),
			array(
				array(
					'coupon_id'    => $retrievals[0]['coupon_id'],
					'retrieved_at' => $retrievals[0]['timestamp'],
				),
				array(
					'coupon_id'    => $retrievals[1]['coupon_id'],
					'retrieved_at' => $retrievals[1]['timestamp'],
				),
			)
		);
		$this->assertEquals(
			$user->get_groups_data(),
			array(
				array(
					'group_id'                 => $group_id,
					'last_retrieval_timestamp' => $retrievals[1]['timestamp'],
				),
			)
		);
		$this->assertEquals(
			( new Coupon( $retrievals[1]['coupon_id'] ) )->get_user_id(),
			$wp_user_id
		);
	}

	public function test_recording() {
		$wp_user_id = $this->factory->user->create();
		$user       = new User( $wp_user_id );

		$group_id  = 123;
		$retrieval = array(
			'coupon_id' => 321,
			'group_id'  => $group_id,
			'timestamp' => 0,
		);
		$popup     = array(
			'group_id'  => $group_id,
			'timestamp' => 1,
		);

		$user->record_retrieval( $retrieval );
		$user->record_popup( $popup );

		$this->assertEquals(
			array(
				array(
					'group_id'                 => $group_id,
					'last_retrieval_timestamp' => $retrieval['timestamp'],
					'last_popup_timestamp'     => $popup['timestamp'],
				),
			),
			$user->get_groups_data()
		);
	}
}
