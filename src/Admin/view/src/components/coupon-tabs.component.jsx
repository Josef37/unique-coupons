import React, { useState } from "react";
import { map } from "lodash-es";
import { useDispatch, useSelector } from "react-redux";
import {
	couponBulkActionCreators,
	selectCouponById,
	selectCouponsByStatus,
} from "../redux/coupons.slice";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { styled } from "@material-ui/core/styles";
import ActionTable from "./action-table.component";
import Paginated from "./paginated.component";
import { getDateText } from "../utils";

const CouponTabs = ({ groupId, isFetching }) => {
	const [state, setState] = useState("active");

	const coupons = useSelector((state) => selectCouponsByStatus(state, groupId));
	const couponIds = map(coupons[state], "id");

	return (
		<>
			<AppBar position="static" color="default">
				<Tabs value={state} onChange={(_event, newValue) => setState(newValue)}>
					<Tab value="active" label="Active" />
					<Tab value="inactive" label="Inactive" />
					<Tab value="used" label="Used" />
					<Tab value="expired" label="Expired" />
				</Tabs>
			</AppBar>
			<Paginated
				key={state}
				items={couponIds}
				perPage={12}
				getComponent={(ids) => (
					<ActionTable
						key={ids}
						ids={ids}
						Row={({ id }) => <CouponRow couponId={id} />}
						BulkActions={getBulkActionsComponent(state)}
						isFetching={isFetching}
					/>
				)}
			/>
		</>
	);
};

const CouponRow = ({ couponId }) => {
	const { value, expiresAt, userId } = useSelector((state) =>
		selectCouponById(state, couponId)
	);

	return (
		<Row>
			<Typography component="b">{value}</Typography>
			<Typography>{getDateText(expiresAt)}</Typography>
			{userId ? <Typography>User ID: {userId}</Typography> : null}
		</Row>
	);
};

const Row = styled("div")(({ theme }) => ({
	display: "flex",
	width: "100%",
	textAlign: "center",
	gap: theme.spacing(2),
	"& > *": {
		minWidth: 150,
	},
}));

const actionsForState = {
	active: ["deactivate", "delete"],
	inactive: ["activate", "delete"],
	used: ["delete"],
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
