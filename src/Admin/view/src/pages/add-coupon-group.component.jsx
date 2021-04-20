import Snackbar from "@material-ui/core/Snackbar";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CouponGroupEditor from "../components/coupon-group-editor.component";
import { addGroup } from "../redux/coupons.slice";

const AddCouponGroupPage = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const [error, setError] = useState("");
	const [isLoading, setLoading] = useState(false);

	const handleSubmit = (values) => {
		if (!values.name) {
			setError("Name cannot be empty.");
			return;
		}
		setLoading(true);
		dispatch(addGroup(values))
			.then(unwrapResult)
			.then(({ id }) => history.push(`/group/${id}`))
			.catch(({ message }) => setError(message))
			.finally(() => setLoading(false));
	};

	return (
		<>
			<CouponGroupEditor
				initialValues={{
					name: "",
					description: "",
					template: "",
					isActive: true,
				}}
				handleSubmit={handleSubmit}
				submitButtonText="Add this coupon group"
				isLoading={isLoading}
			/>
			<Snackbar
				open={!!error}
				autoHideDuration={6000}
				message={error}
				onClose={(event, reason) =>
					reason === "clickaway" || setError("")
				}
			/>
		</>
	);
};

export default AddCouponGroupPage;
