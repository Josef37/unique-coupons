import React from 'react';
import { Link } from "react-router-dom"
import AddIcon from "@material-ui/icons/Add"
import CouponGroupsList from '../components/coupon-groups-list.component';
import ActionButton from '../components/action-button.component';

const DashboardPage = () => {
	return <>
		<CouponGroupsList />
		<ActionButton component={Link} to="/add-coupon-group" Icon={AddIcon}>Add a new coupon group</ActionButton>
	</>
}

export default DashboardPage;
