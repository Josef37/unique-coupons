import React from 'react';
import { useSelector } from 'react-redux';
import CouponGroupsList from '../components/coupongroups-list.component';
import { selectCouponGroupsIds } from "../redux/coupons.slice"

const Dashboard = () => {
	const couponGroupIds = useSelector(selectCouponGroupsIds)

	return <div>
		<h2>Dashboard</h2>
		{couponGroupIds.map(id => <CouponGroupsList key={id} groupId={id} />)}
	</div>
}

export default Dashboard;
