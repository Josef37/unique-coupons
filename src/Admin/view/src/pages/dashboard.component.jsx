import React from 'react';
import CouponGroupsList from '../components/coupon-groups-list.component';
import AddButton from '../components/add-button.component';

const DashboardPage = () => {
	return <>
		<CouponGroupsList />
		<AddButton to="/add-coupon-group" label="add new coupon group">Add a new coupon group</AddButton>
	</>
}

export default DashboardPage;
