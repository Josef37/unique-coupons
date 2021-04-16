<?php

use WPCoupons\Models\CouponGroup;
use WPCoupons\Models\User;
use WPCoupons\Options;
use WPCoupons\Services\PopupService;
use WPCouponsTest\Factory\CouponFactory;
use WPCouponsTest\Factory\CouponGroupFactory;

class PopupServiceTest extends \WP_UnitTestCase {
	/** @var User */
	private $user;
	/** @var PopupService */
	private $service;

	public function setUp() {
		parent::setUp();

		$user_id       = $this->factory->user->create();
		$this->user    = new User( $user_id );
		$this->service = new PopupService( $this->user );
	}

	public function test_get_possible_group_unauthorized_user() {
		add_filter( 'wp_coupons_user_is_authorized_for_coupons', '__return_false' );

		$this->expectException( \Exception::class );
		$this->service->get_possible_group();
	}

	public function test_get_possible_group_no_groups() {
		$this->expectException( \Exception::class );
		$this->service->get_possible_group();
	}

	public function test_get_possible_group_no_active_group() {
		$group_id = CouponGroupFactory::create_inactive_group();
		foreach ( range( 1, 3 ) as $_index ) {
			CouponFactory::create_distributable_coupon( $group_id );
		}

		$this->expectException( \Exception::class );
		$this->service->get_possible_group();
	}

	public function test_get_possible_group_popped_up_recently() {
		$group_id = CouponGroupFactory::create_active_group();
		CouponFactory::create_distributable_coupon( $group_id );

		$this->user->record_popup(
			array(
				'group_id' => $group_id,
				'datetime' => date( 'Y-m-d H:i:s' ),
			)
		);

		$this->expectException( \Exception::class );
		$this->service->get_possible_group();
	}

	public function test_get_possible_group_retrieved_recently() {
		$group_id  = CouponGroupFactory::create_active_group();
		$coupon_id = CouponFactory::create_distributable_coupon( $group_id );
		CouponFactory::create_distributable_coupon( $group_id );

		$this->user->record_retrieval(
			array(
				'coupon_id' => $coupon_id,
				'group_id'  => $group_id,
				'datetime'  => date( 'Y-m-d H:i:s' ),
			)
		);

		$this->expectException( \Exception::class );
		$this->service->get_possible_group();
	}

	public function test_get_possible_group_no_distributable_coupons() {
		$group_id = CouponGroupFactory::create_active_group();
		CouponFactory::create_expired_coupon( $group_id );

		$this->expectException( \Exception::class );
		$this->service->get_possible_group();
	}

	public function test_get_possible_group_success() {
		$other_group_id  = CouponGroupFactory::create_active_group();
		$group_id        = CouponGroupFactory::create_active_group();
		$used_coupon_id  = CouponFactory::create_distributable_coupon( $group_id );
		$fresh_coupon_id = CouponFactory::create_distributable_coupon( $group_id );

		$this->user->record_retrieval(
			array(
				'coupon_id' => $used_coupon_id,
				'group_id'  => $group_id,
				'datetime'  => date( 'Y-m-d H:i:s', time() - 60 - Options::get_seconds_between_same_retrieval() ),
			)
		);

		$this->user->record_popup(
			array(
				'group_id' => $group_id,
				'datetime' => date( 'Y-m-d H:i:s', time() - 60 - Options::get_seconds_between_same_popup() ),
			)
		);

		$this->assertEquals(
			$group_id,
			$this->service->get_possible_group()->group_id
		);
	}

	public function test_retrieve_coupon_for() {
		$group_id  = CouponGroupFactory::create_active_group();
		$group     = new CouponGroup( $group_id );
		$coupon_id = CouponFactory::create_distributable_coupon( $group_id );

		$this->assertEquals(
			$coupon_id,
			$this->service->retrieve_coupon_for( $group )->coupon_id
		);

		$this->expectException( \Exception::class );
		$this->service->retrieve_coupon_for( $group );
	}
}
