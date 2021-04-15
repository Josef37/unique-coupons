<?php
namespace WPCoupons\Services;

use WPCoupons\Models\User;
use WPCoupons\Models\CouponGroup;
use WPCoupons\Utils;

/**
 * Handles interactions with coupons for public users.
 */
class PopupService {
	/** @var User */
	public $user;

	public function __construct( User $user = null ) {
		$this->user = $user ?? new User( get_current_user_id() );
	}

	/**
	 * Find a group to display (regarding previously retrieved/displayed coupons)
	 * for users who can and want to receive coupons (in general).
	 *
	 * @todo allow users to ignore specific groups
	 * @throws \Exception No CouponGroup found.
	 */
	public function get_possible_group(): CouponGroup {
		if ( ! $this->user->can_receive_coupons() ) {
			throw new \Exception( 'User cannot receive coupons' );
		}

		$active_groups = CouponGroup::get_active_groups();

		$possible_group = Utils::array_find(
			$active_groups,
			function( $group ) {
				return ! $this->user->has_recent_popup_for_group( $group )
					&& ! $this->user->has_recent_retrieval_for_group( $group )
					&& $group->has_distributable_coupons();
			}
		);

		if ( ! $possible_group ) {
			throw new \Exception( 'No possible group found' );
		}
		return $possible_group;
	}

	/*
	 * @todo implement
	 *
	 * public function retrive_coupon( $group_id ) {}
	 * Check, if authorized.
	 * Return the closest to expire coupon.
	 * Record the action.
	 */

	/*
	 * @todo implement
	 *
	 * public function recall_retrieved_coupons() {}
	 * Get them from the db with timestamp
	 */
}
