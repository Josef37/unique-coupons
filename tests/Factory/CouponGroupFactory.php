<?php

namespace UniqueCouponsTest\Factory;

use UniqueCoupons\Models\CouponGroup;

class CouponGroupFactory {
	/** @var int */
	private static $count = 1;

	public static function create( $values = array() ): int {
		$default_values = array(
			'name'        => 'Group ' . self::$count++,
			'description' => 'Default Description',
			'template'    => 'Default Template',
			'is_active'   => true,
		);
		return CouponGroup::insert( array_merge( $default_values, $values ) );
	}

	public static function create_active_group(): int {
		return self::create( array( 'is_active' => true ) );
	}

	public static function create_inactive_group(): int {
		return self::create( array( 'is_active' => false ) );
	}
}
