<?php
namespace WPCoupons;

class Utils {
	/**
	 * Joins any number of paths with exactly one `/` between each.
	 * Does not remove leading or trailing slashes.
	 *
	 * @see https://stackoverflow.com/a/15575293/5312432
	 */
	public static function join_paths() {
		$paths = array_filter( func_get_args() );
		return preg_replace( '#/+#', '/', join( '/', $paths ) );
	}

	/**
	 * Tests if $haystack starts with $needle.
	 *
	 * @see https://stackoverflow.com/a/10473026/5312432
	 */
	public static function starts_with( $haystack, $needle ) {
		return substr_compare( $haystack, $needle, 0, strlen( $needle ) ) === 0;
	}

	/**
	 * Tests if $haystack ends with $needle.
	 *
	 * @see https://stackoverflow.com/a/10473026/5312432
	 */
	public static function ends_with( $haystack, $needle ) {
		return substr_compare( $haystack, $needle, -strlen( $needle ) ) === 0;
	}

	/**
	 * Gets JSON from remote URL with `wp_remote_get`.
	 */
	public static function get_json( $url, $args = array() ) {
		$response = wp_remote_get( $url, $args );
		if ( $response instanceof \WP_Error ) {
			throw new \Exception( 'Failed to get JSON file.' );
		}

		$json = json_decode( $response['body'], true );
		if ( is_null( $json ) ) {
			throw new \Exception( 'Failed to parse JSON file.' );
		}

		return $json;
	}
}
