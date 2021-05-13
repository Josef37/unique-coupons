import Button from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
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
	selectCouponGroupById,
} from "../redux/coupons.slice";

const CouponGroupPage = ({ groupId }) => {
	const group = useSelector((state) => selectCouponGroupById(state, groupId));
	const isValidGroupId = undefined !== group;
	const [isFetching, setFetching] = useState(true);
	const [isEditing, setEditing] = useState(false);
	const [isSaving, setSaving] = useState(false);
	const [, setError] = useState("");
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
				dispatch(editGroup({ groupId, ...values })).then(() => {
					setEditing(false);
					setSaving(false);
				});
			}}
			submitButtonText="Save changes"
			isLoading={isSaving}
		/>
	) : (
		<div>
			<Header>
				<HeaderMain>
					<Text variant="h3">{name}</Text>
					{description && <Text variant="subtitle1">{description}</Text>}
					<CouponGroupSwitch
						isActive={isActive}
						handleChange={(isActive) =>
							dispatch(editGroup({ groupId, isActive }))
						}
					/>
				</HeaderMain>
				<HeaderAside>
					<Button
						onClick={() => setEditing(true)}
						endIcon={<EditIcon />}
						variant="contained"
					>
						Edit
					</Button>
					<Button
						href={window.UNIQUE_COUPONS.api.preview.replace(
							"preview-group-id",
							groupId
						)}
						target="_blank"
						rel="noreferrer"
						endIcon={<OpenInNewIcon />}
						variant="contained"
					>
						Preview
					</Button>
				</HeaderAside>
			</Header>

			<TemplateEditor template={template} disabled />

			<Typography variant="h4" gutterBottom>
				Coupons
			</Typography>
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

const Text = styled(Typography)({
	padding: `7px 0 8px`,
});
const Header = styled("div")({
	display: "flex",
	alignItems: "center",
});
const HeaderMain = styled("div")({
	flexGrow: 1,
});
const HeaderAside = styled("div")(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-end",
	gap: theme.spacing(2),
}));

export default CouponGroupPage;
