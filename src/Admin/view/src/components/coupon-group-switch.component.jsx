import React from "react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const CouponGroupSwitch = ({ isActive, handleChange }) => {
	return (
		<FormControlLabel
			label="Is active?"
			control={
				<Switch
					checked={isActive}
					onChange={(event) => handleChange(event.target.checked)}
				/>
			}
		/>
	);
};

export default CouponGroupSwitch;
