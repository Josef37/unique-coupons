import React from 'react';
import CouponGroupsList from '../components/coupon-groups-list.component';
import AddCouponGroupButton from '../components/add-coupon-group-button.component';

const DashboardPage = () => {
	return <>
		<CouponGroupsList />
		<AddCouponGroupButton />
	</>
}

export default DashboardPage;
