<?php

namespace UniqueCouponsTest\Factory;

use UniqueCoupons\Models\Coupon;
use UniqueCoupons\Options;
use UniqueCoupons\Utils;

class CouponFactory {
	/** @var int */
	private static $count = 1;

	public static function create( $values ): int {
		$default_values = array(
			'value'      => 'Coupon ' . self::$count++,
			'expires_at' => time(),
			'status'     => 'publish',
		);

		return Coupon::insert( array_merge( $default_values, $values ) );
	}

	public static function create_distributable_coupon( $group_id, $time_buffer_in_seconds = 60 ) {
		$expires_at = time()
			+ $time_buffer_in_seconds
			+ Options::get_seconds_valid_after_distribution();
		return self::create(
			array(
				'group_id'   => $group_id,
				'expires_at' => $expires_at,
			)
		);
	}

	public static function create_expired_coupon( $group_id ) {
		return self::create(
			array(
				'group_id'   => $group_id,
				'expires_at' => strtotime( '-1 day' ),
			)
		);
	}
}
