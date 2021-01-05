import React from 'react';
import _ from "lodash"
import { useSelector } from 'react-redux';
import { selectCouponById, selectCouponGroupById } from '../redux/coupons.slice';
import { format, parse } from "date-fns"
import Typography from '@material-ui/core/Typography';
import ActionTable from './action-table.component';

const todaysDateString = format(new Date(), "yyyy-MM-dd")

const CouponLists = ({ groupId, isFetching }) => {
	const { couponIds } = useSelector(state => selectCouponGroupById(state, groupId))
	const coupons = useSelector(state => couponIds.map(id => selectCouponById(state, id)))

	const [inactiveCoupons, notInactiveCoupons] = _.partition(coupons, coupon => coupon.status !== "publish")
	const [retrievedCoupons, notRetrievedCoupons] = _.partition(notInactiveCoupons, coupon => coupon.userId)
	const [expiredCoupons, activeCoupons] = _.partition(notRetrievedCoupons, coupon => coupon.expiresAt < todaysDateString)

	return <>
		<Typography variant="h5">Active Coupons</Typography>
		<ActionTable
			ids={_.map(activeCoupons, 'id')}
			Row={({ id }) => <CouponRow couponId={id} />}
			isFetching={isFetching}
		/>
		<Typography variant="h5">Expired Coupons</Typography>
		<ActionTable
			ids={_.map(expiredCoupons, 'id')}
			Row={({ id }) => <CouponRow couponId={id} />}
			isFetching={isFetching}
		/>
		<Typography variant="h5">Used Coupons</Typography>
		<ActionTable
			ids={_.map(retrievedCoupons, 'id')}
			Row={({ id }) => <UsedCouponRow couponId={id} />}
			isFetching={isFetching}
		/>
		<Typography variant="h5">Inactive Coupons</Typography>
		<ActionTable
			ids={_.map(inactiveCoupons, 'id')}
			Row={({ id }) => <CouponRow couponId={id} />}
			isFetching={isFetching}
		/>
	</>
}

const CouponRow = ({ couponId }) => {
	const { value, expiresAt } = useSelector(state => selectCouponById(state, couponId));

	return <div>
		<b>{value}</b><br />
		<i>{format(parse(expiresAt, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy')}</i>
	</div>
}

const UsedCouponRow = ({ couponId }) => {
	const { value, expiresAt, userId } = useSelector(state => selectCouponById(state, couponId));

	return <div>
		<b>{value}</b><br />
		<i>{format(parse(expiresAt, 'yyyy-MM-dd', new Date()), 'dd MMMM yyyy')}</i><br />
		<span>{userId}</span>
	</div>
}

export default CouponLists;
