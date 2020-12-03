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

$react_assets_url = plugin_dir_url( __FILE__ ) . 'src/Admin/view/build';
$root_element_id  = 'wp-coupons-root';
new WPCoupons\Admin\Menu( $react_assets_url, $root_element_id );
