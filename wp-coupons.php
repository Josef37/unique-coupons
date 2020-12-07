<?php
/**
 * Plugin Name:     WP Coupons
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     Distribute unique coupons to your users
 * Author:          Josef Wittmann <josef.wittmann@tutanota.com>
 * Author URI:      https://josefwittmann.dev
 * Text Domain:     wp-coupons
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         Wp_Coupons
 */

require __DIR__ . '/vendor/autoload.php';

function run_wp_coupons_plugin() {
	$version         = '0.1.0';
	$plugin_root_dir = plugin_dir_path( __FILE__ );
	$plugin_root_url = plugin_dir_url( __FILE__ );
	$loader          = new WPCoupons\Loader( $version, $plugin_root_dir, $plugin_root_url );
	$loader->run();
}

run_wp_coupons_plugin();
