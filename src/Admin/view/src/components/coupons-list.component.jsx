import React from 'react';

import data from "../data"

const CouponsList = ({ groupId }) => {
	const coupons = data.couponGroups[groupId].coupons
	return coupons.map(({ id, value, expiresAt }) => <div key={id}>
		Value: <b>{value}</b>
		Expires at: <b>{new Date(expiresAt).toDateString()}</b>
	</div>)
}

export default CouponsList;
