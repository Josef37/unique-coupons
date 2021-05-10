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
					template: defaultTemplate,
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
				onClose={(event, reason) => reason === "clickaway" || setError("")}
			/>
		</>
	);
};

const defaultTemplate = `
<p style="text-align: center;">
	This is some introduction text. It will be visible all the time. [shortcodes] are supported!
</p>
<p style="text-align: center;">
	Text with functionality is highlighted with a dashed border around (which won't be shown to the user).
	Hover above it to see which functionality it has.
	Clicking the four buttons above the content will toggle the functionality for the selected text.
</p>
<p style="text-align: center;">
	<button class="unique-coupons-popup__button">Clicking this button will fetch the coupon.</button>
</p>
<div class="unique-coupons-popup__coupon" style="text-align: center;">
  This area will be hidden, until the coupon was successfully fetched.
  Make sure to have the value marked up somewhere, or your users won't be very happy. For example:
	Your coupon is <span class="unique-coupons-popup__value">value</span>
  and expires at <span class="unique-coupons-popup__expires-at" style="white-space: nowrap;">date</span>.
	"value" and "date" will be replaced with the according data.
</div>
`;

export default AddCouponGroupPage;
