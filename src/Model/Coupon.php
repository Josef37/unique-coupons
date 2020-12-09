<?php
namespace WPCoupons\Model;

class Coupon {
	/**
	 * Registers the custom post type for Coupon.
	 */
	public static function register() {
		register_post_type(
			'wp_coupon',
			array(
				'label'                 => 'Coupons',
				'public'                => false,
				'hierarchical'          => false,
				'supports'              => array( 'title', 'editor', 'custom-fields', 'page-attributes' ),
				'rewrite'               => false,
				'show_in_rest'          => true,
				'rest_base'             => 'wp_coupon',
				'rest_controller_class' => 'WP_REST_Posts_Controller',
			)
		);

		register_post_meta(
			'wp_coupon',
			'expires_at',
			array(
				'type'         => 'number',
				'description'  => 'Last day of coupon validity (in site\'s time-zone), stored in MySQL date format Y-m-d (e.g. 2020-12-24).',
				'single'       => true,
				'show_in_rest' => array(
					'schema' => array(
						'type'        => 'number',
						'arg_options' => array(
							'validate_callback' => '__return_false',
						),
					),
				),
			)
		);

		register_post_meta(
			'wp_coupon',
			'user_id',
			array(
				'type'         => 'number',
				'description'  => 'ID of user, who received the coupon.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);
	}

	/**
	 * Inserts a new Coupon into the database.
	 *
	 * @param array $args ['value' => string, 'group_id' => int, 'expires_at => date in mysql format as string, 'status' => string].
	 * @throws \Exception From `wp_insert_post`.
	 * @return int The post ID.
	 */
	public static function insert( $args ) {
		$defaults = array(
			'status' => 'publish',
		);

		list(
			'value'      => $value,
			'group_id'   => $group_id,
			'expires_at' => $expires_at,
			'status'     => $status,
		) = wp_parse_args( $args, $defaults );

		$postarr         = array(
			'post_title'  => $value,
			'post_status' => $status,
			'post_type'   => 'wp_coupon',
			'tax_input'   => array( 'wp_coupon_group' => $group_id ),
			'meta_input'  => array( 'expires_at' => $expires_at ),
		);
		$do_return_error = true;

		$id_or_error = wp_insert_post( $postarr, $do_return_error );

		if ( is_wp_error( $id_or_error ) ) {
			$error = $id_or_error;
			throw new \Exception( $error->get_error_message() );
		}

		$id = $id_or_error;
		return $id;
	}
}
