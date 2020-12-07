import React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import { selectCouponGroupsIds } from "../redux/coupons.slice"
import CouponGroupRow from "./coupon-group-row.component"

const CouponGroupsList = () => {
	const couponGroupIds = useSelector(selectCouponGroupsIds)

	return <Box marginBottom={2}>
		<Paper>
			{couponGroupIds.map(id =>
				<CouponGroupRow key={id} groupId={id} />
			)}
		</Paper>
	</Box>
}

export default CouponGroupsList;
