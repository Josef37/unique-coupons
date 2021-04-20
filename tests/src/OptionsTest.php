<?php

use WPCoupons\Options;

class OptionsTest extends WP_UnitTestCase {
	public function test_get_options() {
		$this->assertEquals(
			Options::$default_options,
			Options::get_options()
		);
	}

	public function test_set_option() {
		list( $key, $option ) = array( 'time_between_any_popup', 10 );
		Options::set_option( $key, $option );

		$this->assertEquals(
			$option,
			Options::get_option( $key )
		);
	}
}
