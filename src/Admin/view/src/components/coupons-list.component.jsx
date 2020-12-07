import React from 'react';
import { useSelector } from 'react-redux';
import { selectCouponGroupById } from '../redux/coupons.slice';
import CouponRow from './coupon-row.component';
import ActionTable from './action-table.component';

const CouponsList = ({ groupId }) => {
	const { couponIds } = useSelector(state => selectCouponGroupById(state, groupId))

	return <ActionTable
		ids={couponIds}
		Row={({ id }) => <CouponRow couponId={id} />}
	/>
}

export default CouponsList;
