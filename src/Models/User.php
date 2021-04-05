<?php
namespace WPCoupons\Models;

use WPCoupons\Utils;

class User {
	const RETRIEVALS_META_KEY = 'wp_coupons_retrievals';
	const GROUPS_META_KEY     = 'wp_coupons_groups';

	public $user_id;

	public function __construct( $user_id = null ) {
		$this->user_id = $user_id ?? get_current_user_id();
	}

	public function can_receive_coupons() {
		return $this->is_eligible_for_coupons()
			&& ! $this->has_opted_out_from_coupons()
			&& ! $this->time_since_last_popup_too_close();
	}

	public function is_eligible_for_coupons() {
		return apply_filters( 'wp_coupons_user_is_eligible', true, $this->user_id );
	}

	/** @todo add field to user meta */
	public function has_opted_out_from_coupons() {
		return false;
	}

	/** @todo get time delta from options */
	public function time_since_last_popup_too_close() {
		return false;
	}

	public function get_retrievals() {
		return get_user_meta( $this->user_id, self::RETRIEVALS_META_KEY );
	}

	public function get_groups() {
		return get_user_meta( $this->user_id, self::GROUPS_META_KEY );
	}

	public function get_last_retrieval_datetime() {
		return $this->get_last_datetime_across_groups( 'last_retrieval_datetime' );
	}

	public function get_last_popup_datetime() {
		return $this->get_last_datetime_across_groups( 'last_popup_datetime' );
	}

	private function get_last_datetime_across_groups( $key ) {
		$datetimes = array_column( $this->get_groups(), $key );
		return max( $datetimes );
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

	private function update_group_meta( $data ) {
		$previous_groups_meta = get_user_meta( $this->user_id, self::GROUPS_META_KEY );

		$group_index = array_search( $data['group_id'], array_column( $previous_groups_meta, 'group_id' ) );
		if ( false === $group_index ) {
			add_user_meta( $this->user_id, self::GROUPS_META_KEY, $data );
		} else {
			$previous_meta = $previous_groups_meta[ $group_index ];
			$current_meta  = array_merge( $previous_meta, $data );
			update_user_meta( $this->user_id, self::GROUPS_META_KEY, $current_meta, $previous_meta );
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
			self::GROUPS_META_KEY,
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
