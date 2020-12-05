import React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import CouponGroupRow from '../components/coupon-group-row.component';
import { selectCouponGroupsIds } from "../redux/coupons.slice"

const Dashboard = () => {
	const couponGroupIds = useSelector(selectCouponGroupsIds)

	return <div>
		<h2>Dashboard</h2>
		<Box marginX={3}>
			<Paper>
				{couponGroupIds.map(id =>
					<CouponGroupRow key={id} groupId={id} />
				)}
			</Paper>
		</Box>
	</div>
}

export default Dashboard;
