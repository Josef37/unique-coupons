import React from 'react';
import { useStore } from 'react-redux';
import { selectCouponGroupById, selectCouponById } from '../redux/coupons.slice';

const CouponsList = ({ groupId }) => {
	const state = useStore().getState()
	const { couponIds } = selectCouponGroupById(state, groupId)
	const coupons = couponIds.map(couponId => selectCouponById(state, couponId))

	return coupons.map(({ id, value, expiresAt }) => <div key={id}>
		Value: <b>{value}</b>
		Expires at: <b>{new Date(expiresAt).toDateString()}</b>
	</div>)
}

export default CouponsList;
