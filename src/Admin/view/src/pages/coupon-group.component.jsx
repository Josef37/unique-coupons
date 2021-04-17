import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ActionButton from "../components/action-button.component";
import CouponGroupEditor from "../components/coupon-group-editor.component";
import CouponGroupSwitch from "../components/coupon-group-switch.component";
import CouponTabs from "../components/coupon-tabs.component";
import TemplateEditor from "../components/template-editor.component";
import {
	editGroup,
	getCoupons,
	selectCouponGroupById
} from "../redux/coupons.slice";

const CouponGroupPage = ({ groupId }) => {
	const group = useSelector((state) => selectCouponGroupById(state, groupId));
	const isValidGroupId = undefined !== group;
	const [isFetching, setFetching] = useState(true);
	const [isEditing, setEditing] = useState(false);
	const [isSaving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const classes = useStyles();
	const dispatch = useDispatch();
	React.useEffect(() => {
		if (isValidGroupId) {
			dispatch(getCoupons(groupId))
				.then(unwrapResult)
				.then(() => setFetching(false))
				.catch(({ message }) => setError(message));
		}
	}, [dispatch, isValidGroupId, groupId]);

	if (!isValidGroupId) {
		return (
			<Typography variant="body1">
				There is no group with ID {groupId}
			</Typography>
		);
	}

	const { name, description, template, isActive } = group;
	return isEditing ? (
		<CouponGroupEditor
			initialValues={group}
			handleSubmit={(values) => {
				setSaving(true);
				dispatch(editGroup({ groupId, ...values }))
					.then(() => {
						setEditing(false);
						setSaving(false);
					});
			}}
			submitButtonText="Save changes"
			isLoading={isSaving}
		/>
	) : (
		<div>
			<div className={classes.header}>
				<Typography variant="h3" className={classes.text}>
					{name}
				</Typography>
				<Button
					onClick={() => setEditing(true)}
					variant="contained"
					startIcon={<EditIcon />}
					className={classes.button}
				>
					Edit
				</Button>
			</div>
			{description && (
				<Typography variant="subtitle1" className={classes.text}>
					{description}
				</Typography>
			)}
			<CouponGroupSwitch
				isActive={isActive}
				handleChange={(isActive) =>
					dispatch(editGroup({ groupId, isActive }))
				}
			/>
			<TemplateEditor template={template} disabled />

			<Typography variant="h4" gutterBottom>Coupons</Typography>
			<CouponTabs groupId={groupId} isFetching={isFetching} />

			<ActionButton
				component={Link}
				to={`/add-coupons/${groupId}`}
				Icon={AddIcon}
			>
				Add coupons to this group
			</ActionButton>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	text: {
		padding: `7px 0 8px`,
	},
	header: {
		display: "flex",
		alignItems: "center",
		"& > *:first-child": {
			flexGrow: 1,
		},
	},
}));

export default CouponGroupPage;
