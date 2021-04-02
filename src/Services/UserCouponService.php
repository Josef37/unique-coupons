<?php
namespace WPCoupons\Services;

/**
 * Handles interactions with coupons for public users.
 */
class UserCouponService {
	public function __construct( $user_id ) {
		$this->user_id = $user_id;
	}

	/** @todo */
	public function can_retrieve_coupons() {
		// User is active member
		// User had last retrieval a while ago (to prevent spam)
		throw new \BadMethodCallException( 'Not implemented' );
	}

	/** @todo */
	public function get_possible_group_id() {
		// Finds a coupon group (best suited for this user).
		throw new \BadMethodCallException( 'Not implemented' );
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
