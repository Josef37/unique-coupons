<?php
namespace WPCoupons\Services;

/**
 * Handles interactions with coupons for public users.
 */
class UserCouponService {
	private $user;

	public function __construct( $user ) {
		$this->user = $user;
	}

	/** @todo */
	public function get_possible_group_id() {
		// Finds a coupon group (best suited for this user).
		// Find a group to display (regarding previously retrieved/displayed coupons).
		return 0;
	}

	/** @todo */
	public function retrive_coupon( $group_id ) {
		// Check, if eligible
		// Return the closest to expire coupon
		// Record the action
		throw new \BadMethodCallException( 'Not implemented' );
	}

	/** @todo */
	public function recall_retrieved_coupons() {
		// Get them from the db with timestamp
		throw new \BadMethodCallException( 'Not implemented' );
	}
}
