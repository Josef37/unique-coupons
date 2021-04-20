<?php
namespace WPCoupons\Controllers;

use WPCoupons\Services\PopupService;

/**
 * Gets called when an automatic popup could be loaded on a page.
 *
 * @todo refactor enqueuing scripts to only depend on a script loader.
 */
class PopupController {
	public function init_popup() {
		try {
			$group = ( new PopupService() )->get_possible_group();
			$this->enqueue_template( $group );
			$this->enqueue_script();
		} catch ( \Exception $ex ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch
			// We could not find a group to display, so just do nothing.
		}
	}

	private function enqueue_template( $group ) {
		add_action( 'wp_footer', array( $group, 'echo_popup' ) );
	}

	private function enqueue_script() {
		add_action(
			'wp_enqueue_scripts',
			function() {
				wp_enqueue_style( 'wp-coupons-popup' );
				wp_enqueue_script( 'wp-coupons-popup' );
			}
		);
	}
}
