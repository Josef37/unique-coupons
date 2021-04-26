import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { styled } from "@material-ui/core/styles";
import { addCoupons, selectCouponGroupById } from "../redux/coupons.slice";
import ActionButton from "../components/action-button.component";
import BackLink from "../components/back-link.component";

const AddCouponsPage = ({ groupId }) => {
	const group = useSelector((state) => selectCouponGroupById(state, groupId));
	const isValidGroupId = undefined !== group;
	const [expiresAtInput, setExpiresAtInput] = useState(Date.now());
	const [couponsInput, setCouponsInput] = useState("");
	const [error, setError] = useState("");
	const [isFetching, setFetching] = useState(false);
	const dispatch = useDispatch();
	const history = useHistory();

	const handleAdd = () => {
		if (!couponsInput || !expiresAtInput) {
			setError("Fill all inputs first.");
			return;
		}
		const couponValues = couponsInput
			.split(/\r?\n/)
			.map((value) => value.trim())
			.filter((value) => value !== "");

		const expiresAt = Math.round(expiresAtInput / 1000);

		setFetching(true);
		dispatch(addCoupons({ couponValues, expiresAt, groupId }))
			.then(unwrapResult)
			.then(() => history.push(`/group/${groupId}`))
			.catch(({ message }) => setError(message))
			.finally(() => setFetching(false));
	};

	if (!isValidGroupId) {
		return (
			<Typography variant="body1">
				There is no group with ID {groupId}
			</Typography>
		);
	}
	const { name: groupName } = group;
	return (
		<div>
			<BackLink to={`/group/${groupId}`}>Back to Group "{groupName}"</BackLink>
			<Typography variant="h3" gutterBottom>
				Add Coupons to Group "{groupName}"
			</Typography>
			<Label>
				<span>Expires at</span>
				<TextField
					type="date"
					valueAsNumber={expiresAtInput}
					autoFocus
					required
					variant="outlined"
					onChange={(e) => setExpiresAtInput(e.target.valueAsNumber)}
				/>
			</Label>
			<Label>
				<span>Coupons</span>
				<TextField
					value={couponsInput}
					multiline
					required
					variant="outlined"
					rows="4"
					rowsMax="16"
					helperText="One coupon per line"
					onChange={(e) => setCouponsInput(e.target.value)}
				/>
			</Label>
			<ActionButton Icon={AddIcon} isLoading={isFetching} onClick={handleAdd}>
				Add coupons
			</ActionButton>
			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				message={error}
				onClose={(event, reason) => reason === "clickaway" || setError("")}
			/>
		</div>
	);
};

const Label = styled("label")(({ theme }) => ({
	display: "flex",
	marginBottom: theme.spacing(3),
	"& > *": { flexBasis: 200 },
}));

export default AddCouponsPage;
