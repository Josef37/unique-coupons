import React from 'react';
import { useSelector } from 'react-redux';
import { selectCouponGroupsIds } from "../redux/coupons.slice"
import ActionTable from './action-table.component';
import CouponGroupRow from './coupon-group-row.component';

const CouponGroupsList = () => {
	const couponGroupIds = useSelector(selectCouponGroupsIds)

	return <ActionTable
		ids={couponGroupIds}
		Row={({ id }) => <CouponGroupRow groupId={id} />}
	/>
}

export default CouponGroupsList;
