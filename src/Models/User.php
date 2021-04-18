<?php
namespace WPCoupons\Models;

use WPCoupons\Options;
use WPCoupons\Utils;

class User {
	const RETRIEVALS_META_KEY  = 'wp_coupons_retrievals';
	const GROUPS_DATA_META_KEY = 'wp_coupons_groups_data';

	/**
	 * ID of the WordPress user.
	 *
	 * @var int
	 */
	public $user_id;

	public function __construct( int $user_id = null ) {
		$this->user_id = $user_id ?? get_current_user_id();
	}

	public function can_receive_coupons() {
		return $this->is_authorized_for_coupons()
			&& ! $this->has_opted_out_from_coupons()
			&& ! $this->has_recent_retrieval()
			&& ! $this->has_recent_popup();
	}

	public function is_authorized_for_coupons() {
		$is_user_logged_in = $this->user_id > 0;
		return (bool) apply_filters(
			'wp_coupons_user_is_authorized_for_coupons',
			$is_user_logged_in,
			$this->user_id
		);
	}

	/** @todo add field to user meta */
	public function has_opted_out_from_coupons() {
		return false;
	}

	public function get_retrievals() {
		return get_user_meta( $this->user_id, self::RETRIEVALS_META_KEY );
	}

	public function get_groups_data() {
		return get_user_meta( $this->user_id, self::GROUPS_DATA_META_KEY );
	}

	public function get_group_data( $group ) {
		return Utils::array_find(
			$this->get_groups_data(),
			function( $group_data ) use ( $group ) {
				return $group_data['group_id'] == $group->group_id;
			},
			array()
		);
	}

	public function has_recent_retrieval() {
		return $this->has_recent_datetime(
			'last_retrieval_datetime',
			Options::get_seconds_between_any_retrieval()
		);
	}

	public function has_recent_popup() {
		return $this->has_recent_datetime(
			'last_popup_datetime',
			Options::get_seconds_between_any_popup()
		);
	}

	private function has_recent_datetime( $key, $time_delta ) {
		$datetimes = array_column( $this->get_groups_data(), $key );
		if ( empty( $datetimes ) ) {
			return false;
		}
		return $this->is_recent_date( max( $datetimes ), $time_delta );
	}

	public function has_recent_popup_for_group( $group ) {
		return $this->has_recent_datetime_for_group(
			$group,
			'last_popup_datetime',
			Options::get_seconds_between_same_popup()
		);
	}

	public function has_recent_retrieval_for_group( $group ) {
		return $this->has_recent_datetime_for_group(
			$group,
			'last_retrieval_datetime',
			Options::get_seconds_between_same_retrieval()
		);
	}

	/** @todo this is something for UserGroup */
	private function has_recent_datetime_for_group( $group, $key, $time_delta ) {
		$group_data = $this->get_group_data( $group );
		if ( ! isset( $group_data[ $key ] ) ) {
			return false;
		}
		return $this->is_recent_date( $group_data[ $key ], $time_delta );
	}

	/** @todo util */
	private function is_recent_date( $recent_date, $time_delta ) {
		$after_recently = strtotime( $recent_date ) + $time_delta;
		$now            = time();
		return $now < $after_recently;
	}

	public function record_retrieval( $data ) {
		list(
			'coupon_id' => $coupon_id,
			'group_id' => $group_id,
			'datetime' => $datetime
		) = $data;

		add_user_meta(
			$this->user_id,
			self::RETRIEVALS_META_KEY,
			array(
				'coupon_id'    => $coupon_id,
				'retrieved_at' => $datetime,
			)
		);
		$this->update_group_meta(
			array(
				'group_id'                => $group_id,
				'last_retrieval_datetime' => $datetime,
			)
		);

		$coupon = new Coupon( $coupon_id );
		$coupon->set_user_id( $this->user_id );
	}

	public function record_popup( $data ) {
		list(
			'group_id' => $group_id,
			'datetime' => $datetime
		) = $data;

		$this->update_group_meta(
			array(
				'group_id'            => $group_id,
				'last_popup_datetime' => $datetime,
			)
		);
	}

	/** @todo make function which updates array meta with comparison function and update function */
	private function update_group_meta( $data ) {
		$previous_groups_meta = get_user_meta( $this->user_id, self::GROUPS_DATA_META_KEY );

		$group_index = array_search( $data['group_id'], array_column( $previous_groups_meta, 'group_id' ) );
		if ( false === $group_index ) {
			add_user_meta( $this->user_id, self::GROUPS_DATA_META_KEY, $data );
		} else {
			$previous_meta = $previous_groups_meta[ $group_index ];
			$current_meta  = array_merge( $previous_meta, $data );
			update_user_meta( $this->user_id, self::GROUPS_DATA_META_KEY, $current_meta, $previous_meta );
		}
	}

	/**
	 * Registers the custom post type for Coupon.
	 */
	public static function register() {
		register_meta(
			'user',
			self::RETRIEVALS_META_KEY,
			array(
				'type'         => 'object',
				'description'  => 'All coupons retrieved by the user.',
				'single'       => false,
				'show_in_rest' => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'coupon_id'    => array( 'type' => 'number' ),
							'retrieved_at' => array(
								'type'    => 'string',
								'pattern' => Utils::get_datetime_regex(),
							),
						),
					),
				),
			)
		);

		register_meta(
			'user',
			self::GROUPS_DATA_META_KEY,
			array(
				'type'         => 'object',
				'description'  => 'Stats for all coupons groups per user.',
				'single'       => false,
				'show_in_rest' => array(
					'schema' => array(
						'type'       => 'object',
						'properties' => array(
							'group_id'                => array( 'type' => 'number' ),
							'last_popup_datetime'     => array(
								'type'    => 'string',
								'pattern' => Utils::get_datetime_regex(),
							),
							'last_retrieval_datetime' => array(
								'type'    => 'string',
								'pattern' => Utils::get_datetime_regex(),
							),
						),
					),
				),
			)
		);
	}
}
