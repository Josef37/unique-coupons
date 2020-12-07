import React from 'react';
import { useSelector } from 'react-redux';
import { format } from "date-fns";
import { selectCouponById } from '../redux/coupons.slice';

const CouponRow = ({ couponId }) => {
	const { value, expiresAt } = useSelector(state => selectCouponById(state, couponId));

	return <div>
		<b>{value}</b><br />
		<i>{format(expiresAt, 'dd MMMM yyyy')}</i>
	</div>;
}

export default CouponRow
