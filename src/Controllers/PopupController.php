<?php
namespace WPCoupons\Controllers;

use WPCoupons\Models\CouponGroup;
use WPCoupons\Models\User;
use WPCoupons\Services\UserCouponService;

/**
 * Gets called when an automatic popup could be loaded on a page.
 *
 * @todo refactor enqueuing scripts to only depend on a script loader.
 */
class PopupController {
	public function init_popup() {
		$user = new User();

		if ( ! $user->can_receive_coupons() ) {
			return;
		}

		$user_coupon_service = new UserCouponService( $user );
		$group_id            = $user_coupon_service->get_possible_group_id();

		$this->enqueue_template( $group_id );
		$this->enqueue_script();
	}

	private function enqueue_template( $group_id ) {
		$group = new CouponGroup( $group_id );
		add_action( 'wp_footer', array( $group, 'echo_popup' ) );
	}

	private function enqueue_script() {
		add_action(
			'wp_enqueue_scripts',
			function() {
				wp_enqueue_script( 'wp-coupons-popup' );
			}
		);
	}
}
