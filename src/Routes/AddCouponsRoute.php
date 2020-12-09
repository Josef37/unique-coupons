<?php
namespace WPCoupons\Routes;

use Exception;
use WPCoupons\Model\Coupon;

class AddCouponsRoute {
	public function __construct( $namespace ) {
		register_rest_route(
			$namespace,
			'/add-coupons',
			array(
				'methdos'             => \WP_REST_Server::CREATABLE,
				'callback'            => array( $this, 'callback' ),
				'permission_callback' => array( $this, 'permission_callback' ),
				'args'                => array(
					'group_id'      => array(
						'required'          => true,
						'validate_callback' => array( $this, 'validate_group_id' ),
						'sanitize_callback' => array( $this, 'sanitize_group_id' ),
					),
					'coupon_values' => array(
						'required'          => true,
						'validate_callback' => array( $this, 'validate_coupon_values' ),
						'sanitize_callback' => array( $this, 'sanitize_coupon_values' ),
					),
				),
			)
		);
	}

	/**
	 * @param \WP_REST_Request $request
	 * @return WP_Error|WP_REST_Response
	 */
	public function callback( $request ) {
		$group_id      = $request->get_param( 'group_id' );
		$coupon_values = $request->get_param( 'coupon_values' );
		$expires_at    = $request->get_param( 'expires_at' );

		$group_term = get_term( $group_id, 'wp_coupon_group' );
		if ( empty( $group_term ) ) {
			return new \WP_Error( 'no_term', "Term with id {$group_id} does not exist in taxonomy wp_coupon_group.", array( 'status' => 404 ) );
		}

		$coupon_ids = array();
		try {
			foreach ( $coupon_values as $coupon_value ) {
				$coupon_ids[] = Coupon::insert(
					array(
						'value'      => $coupon_value,
						'group_id'   => $group_id,
						'expires_at' => $expires_at,
					)
				);
			}
		} catch ( Exception $ex ) {
			foreach ( $coupon_ids as $id ) {
				$skip_trash = true;
				wp_delete_post( $id, $skip_trash );
			}
			return new \WP_Error( 'failed_insert', $ex->getMessage() );
		}

		return \rest_ensure_response( $coupon_ids );
	}

	/**
	 * @param \WP_REST_Request $request
	 * @return WP_Error|bool
	 */
	public function permission_callback( $request ) {
		return current_user_can( 'create_posts' );
	}

	public function validate_group_id( $param, $request, $key ) {
		return is_numeric( $param );
	}

	public function sanitize_group_id( $param, $request, $key ) {
		return absint( $param );
	}

	public function validate_coupon_values( $param, $request, $key ) {
		return wp_is_numeric_array( $param )
			&& \WPCoupons\Utils::array_every( $param, 'is_string' );
	}

	public function sanitize_coupon_values( $param, $request, $key ) {
		return absint( $param );
	}
}
