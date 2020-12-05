import React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper'
import CouponGroupRow from '../components/coupon-group-row.component';
import { selectCouponGroupsIds } from "../redux/coupons.slice"

const Dashboard = () => {
	const couponGroupIds = useSelector(selectCouponGroupsIds)

	return <Paper>
		{couponGroupIds.map(id =>
			<CouponGroupRow key={id} groupId={id} />
		)}
	</Paper>
}

export default Dashboard;
