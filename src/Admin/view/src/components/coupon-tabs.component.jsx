import React, { useState } from 'react';
import _ from "lodash"
import { useSelector } from 'react-redux';
import { selectCouponById, selectCouponGroupById } from '../redux/coupons.slice';
import { format, parse } from "date-fns"
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ActionTable from './action-table.component';

const todaysDateString = format(new Date(), "yyyy-MM-dd")

const CouponTabs = ({ groupId, isFetching }) => {
	const { couponIds } = useSelector(state => selectCouponGroupById(state, groupId))
	const coupons = useSelector(state => couponIds.map(id => selectCouponById(state, id)))
	const [tabValue, setTabValue] = useState("active")

	const [inactiveCoupons, notInactiveCoupons] = _.partition(coupons, coupon => coupon.status !== "publish")
	const [retrievedCoupons, notRetrievedCoupons] = _.partition(notInactiveCoupons, coupon => coupon.userId)
	const [expiredCoupons, activeCoupons] = _.partition(notRetrievedCoupons, coupon => coupon.expiresAt < todaysDateString)

	const couponsByTab = {
		active: activeCoupons,
		inactive: inactiveCoupons,
		retrieved: retrievedCoupons,
		expired: expiredCoupons
	}

	return <>
		<AppBar position="static" color="default">
			<Tabs
				value={tabValue}
				onChange={(event, newValue) => setTabValue(newValue)}
			>
				<Tab value="active" label="Active" />
				<Tab value="inactive" label="Inactive" />
				<Tab value="retrieved" label="Retrieved" />
				<Tab value="expired" label="Expired" />
			</Tabs>
		</AppBar>
		<ActionTable
			ids={_.map(couponsByTab[tabValue], 'id')}
			Row={({ id }) => <CouponRow couponId={id} />}
			isFetching={isFetching}
		/>
	</>
}

const CouponRow = ({ couponId }) => {
	const { value, expiresAt, userId } = useSelector(state => selectCouponById(state, couponId));

	return <div>
		<b>{value}</b><br />
		<i>{format(parse(expiresAt, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy')}</i>
		{userId && <><br /><span>Used by: {userId}</span></>}
	</div>
}

export default CouponTabs;
