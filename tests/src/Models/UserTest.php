<?php

use WPCoupons\Models\Coupon;
use WPCoupons\Models\User;

class UserTest extends WP_UnitTestCase {
	public function test_is_authorized_for_coupons() {
		$is_authorized_for_coupons = function ( $is_authorized, $user_id ) {
			return $user_id > 0;
		};
		add_filter( 'wp_coupons_user_is_authorized', $is_authorized_for_coupons, 10, 2 );

		foreach ( array( 0, 1 ) as $user_id ) {
			$user = new User( $user_id );
			$this->assertEquals( $user->is_authorized_for_coupons(), $is_authorized_for_coupons( true, $user_id ) );
		}
	}

	public function test_get_last_retrieval_datetime() {
		$wp_user_id = $this->factory->user->create();
		$user       = new User( $wp_user_id );

		$retrievals = array(
			array(
				'coupon_id' => 321,
				'group_id'  => 123,
				'datetime'  => '2021-04-05 07:19:20',
			),
			array(
				'coupon_id' => 432,
				'group_id'  => 234,
				'datetime'  => '2021-04-05 07:30:59',
			),
		);

		foreach ( $retrievals as $retrieval ) {
			$user->record_retrieval( $retrieval );
		}

		$this->assertEquals(
			$retrievals[1]['datetime'],
			$user->get_last_retrieval_datetime()
		);
	}

	public function test_record_retrieval() {
		$wp_user_id = $this->factory->user->create();
		$user       = new User( $wp_user_id );

		$group_id   = 123;
		$retrievals = array(
			array(
				'coupon_id' => 1,
				'group_id'  => $group_id,
				'datetime'  => '2021-04-05 07:19:20',
			),
			array(
				'coupon_id' => 2,
				'group_id'  => $group_id,
				'datetime'  => '2021-04-05 07:30:59',
			),
		);

		$user->record_retrieval( $retrievals[0] );

		$this->assertEquals(
			$user->get_retrievals(),
			array(
				array(
					'coupon_id'    => $retrievals[0]['coupon_id'],
					'retrieved_at' => $retrievals[0]['datetime'],
				),
			)
		);
		$this->assertEquals(
			$user->get_groups_data(),
			array(
				array(
					'group_id'                => $group_id,
					'last_retrieval_datetime' => $retrievals[0]['datetime'],
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
					'retrieved_at' => $retrievals[0]['datetime'],
				),
				array(
					'coupon_id'    => $retrievals[1]['coupon_id'],
					'retrieved_at' => $retrievals[1]['datetime'],
				),
			)
		);
		$this->assertEquals(
			$user->get_groups_data(),
			array(
				array(
					'group_id'                => $group_id,
					'last_retrieval_datetime' => $retrievals[1]['datetime'],
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
			'datetime'  => '2021-04-05 07:19:20',
		);
		$popup     = array(
			'group_id' => $group_id,
			'datetime' => '2021-04-05 07:30:59',
		);

		$user->record_retrieval( $retrieval );
		$user->record_popup( $popup );

		$this->assertEquals(
			array(
				array(
					'group_id'                => $group_id,
					'last_retrieval_datetime' => $retrieval['datetime'],
					'last_popup_datetime'     => $popup['datetime'],
				),
			),
			$user->get_groups_data()
		);
	}
}
