import React from "react";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import { styled } from "@material-ui/core/styles";
import CouponGroupsList from "../components/coupon-groups-list.component";
import ActionButton from "../components/action-button.component";

const DashboardPage = () => {
	return (
		<>
			<CouponGroupsList />
			<AddGroupButton />
		</>
	);
};

const AddGroupButton = styled((props) => (
	<ActionButton
		component={Link}
		to="/add-coupon-group"
		Icon={AddIcon}
		{...props}
	>
		Add a new coupon group
	</ActionButton>
))(({ theme }) => ({
	marginTop: theme.spacing(3),
}));

export default DashboardPage;
