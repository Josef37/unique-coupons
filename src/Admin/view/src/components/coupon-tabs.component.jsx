import React, { useState } from "react";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import {
	couponBulkActionCreators,
	selectCouponById,
	selectCouponGroupById,
} from "../redux/coupons.slice";
import { format, parse } from "date-fns";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import ActionTable from "./action-table.component";

const todaysDateString = format(new Date(), "yyyy-MM-dd");

const CouponTabs = ({ groupId, isFetching }) => {
	const { couponIds } = useSelector((state) =>
		selectCouponGroupById(state, groupId)
	);
	const coupons = useSelector((state) =>
		couponIds.map((id) => selectCouponById(state, id))
	);
	const [state, setState] = useState("active");

	const [inactiveCoupons, notInactiveCoupons] = _.partition(
		coupons,
		(coupon) => coupon.status !== "publish"
	);
	const [retrievedCoupons, notRetrievedCoupons] = _.partition(
		notInactiveCoupons,
		(coupon) => coupon.userId
	);
	const [expiredCoupons, activeCoupons] = _.partition(
		notRetrievedCoupons,
		(coupon) => coupon.expiresAt < todaysDateString
	);

	const couponsByTab = {
		active: activeCoupons,
		inactive: inactiveCoupons,
		retrieved: retrievedCoupons,
		expired: expiredCoupons,
	};

	return (
		<>
			<AppBar position="static" color="default">
				<Tabs value={state} onChange={(_event, newValue) => setState(newValue)}>
					<Tab value="active" label="Active" />
					<Tab value="inactive" label="Inactive" />
					<Tab value="retrieved" label="Retrieved" />
					<Tab value="expired" label="Expired" />
				</Tabs>
			</AppBar>
			<ActionTable
				key={state}
				ids={_.map(couponsByTab[state], "id")}
				Row={({ id }) => <CouponRow couponId={id} />}
				BulkActions={getBulkActionsComponent(state)}
				isFetching={isFetching}
			/>
		</>
	);
};

const CouponRow = ({ couponId }) => {
	const { value, expiresAt, userId } = useSelector((state) =>
		selectCouponById(state, couponId)
	);

	return (
		<div>
			<b>{value}</b>
			<br />
			<i>
				{format(parse(expiresAt, "yyyy-MM-dd", new Date()), "dd MMMM yyyy")}
			</i>
			{userId && (
				<>
					<br />
					<span>Used by: {userId}</span>
				</>
			)}
		</div>
	);
};

const actionsForState = {
	active: ["deactivate", "delete"],
	inactive: ["activate", "delete"],
	retrieved: ["delete"],
	expired: ["delete"],
};

const getBulkActionsComponent = (state) => ({ ids }) => {
	const disabled = 0 === ids.length;
	const dispatch = useDispatch();

	const buttons = actionsForState[state].map((action) => {
		const actionCreator = couponBulkActionCreators[action];
		const onClick = () => dispatch(actionCreator(ids));
		return (
			<Button onClick={onClick} disabled={disabled} size="small">
				{action}
			</Button>
		);
	});
	return <>{buttons}</>;
};

export default CouponTabs;
