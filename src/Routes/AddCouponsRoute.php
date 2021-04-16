<?php
namespace WPCoupons\Routes;

use WPCoupons\Models\Coupon;
use WPCoupons\Models\CouponGroup;

class AddCouponsRoute extends \WP_REST_Controller {
	public function __construct( $namespace ) {
		$this->namespace = $namespace;
	}

	public function register_routes() {
		register_rest_route(
			$this->namespace,
			'/add-coupons',
			array(
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'handle_request' ),
					'permission_callback' => array( $this, 'is_user_permitted' ),
					'args'                => $this->get_request_schema(),
				),
				'schema' => array( $this, 'get_response_schema' ),
			)
		);
	}

	/**
	 * @param \WP_REST_Request $request
	 * @return WP_Error|WP_REST_Response
	 */
	public function handle_request( $request ) {
		$group_id      = $request->get_param( 'group_id' );
		$coupon_values = $request->get_param( 'coupon_values' );
		$expires_at    = $request->get_param( 'expires_at' );

		if ( ! CouponGroup::exists( $group_id ) ) {
			return new \WP_Error( 'no_group', 'Could not find group with ID {$group_id} in taxonomy wp_coupon_group.', array( 'status' => 404 ) );
		}

		try {
			$coupon_ids = $this->add_coupons( $group_id, $coupon_values, $expires_at );
		} catch ( \Exception $ex ) {
			$this->revert_add_coupons( $coupon_ids );
			return new \WP_Error( 'failed_insert', $ex->getMessage() );
		}

		return \rest_ensure_response( $coupon_ids );
	}

	protected function add_coupons( $group_id, $coupon_values, $expires_at ) {
		$coupon_ids = array();
		foreach ( $coupon_values as $coupon_value ) {
			$coupon_ids[] = Coupon::insert(
				array(
					'value'      => $coupon_value,
					'group_id'   => $group_id,
					'expires_at' => $expires_at,
				)
			);
		}
		return $coupon_ids;
	}

	protected function revert_add_coupons( $coupon_ids ) {
		foreach ( $coupon_ids as $id ) {
			Coupon::delete( $id );
		}
	}

	/**
	 * @param \WP_REST_Request $request
	 * @return WP_Error|bool
	 */
	public function is_user_permitted( $request ) {
		return current_user_can( 'edit_pages' );
	}

	public function get_request_schema() {
		return array(
			'group_id'      => array(
				'required' => true,
				'type'     => 'integer',
			),
			'coupon_values' => array(
				'required' => true,
				'type'     => 'array',
				'items'    => array(
					'type' => 'string',
				),
			),
			'expires_at'    => array(
				'required' => true,
				'type'     => 'string',
				'pattern'  => \WPCoupons\Utils::get_date_regex(),
			),
		);
	}

	public function get_response_schema() {
		return array(
			'title'       => 'coupon_ids',
			'description' => 'IDs of new coupons',
			'type'        => 'array',
			'items'       => array(
				'type' => 'integer',
			),
		);
	}
}
