import React from "react";
import { useSelector } from "react-redux";
import { selectCouponGroupsIds } from "../redux/coupons.slice";
import CouponGroupRow from "./coupon-group-row.component";
import Paper from "@material-ui/core/Paper";
import RowContainer from "./row-container.component";

const CouponGroupsList = () => {
	const couponGroupIds = useSelector(selectCouponGroupsIds);

	return (
		<Paper>
			{couponGroupIds.map((id) => (
				<RowContainer key={id}>
					<CouponGroupRow groupId={id} />
				</RowContainer>
			))}
		</Paper>
	);
};

export default CouponGroupsList;
