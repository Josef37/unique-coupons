import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import DoneIcon from "@material-ui/icons/Done";
import React, { useState } from "react";
import ActionButton from "../components/action-button.component";
import TemplateEditor from "../components/template-editor.component";

const CouponGroupEditor = ({
	initialValues,
	handleSubmit,
	submitButtonText,
	isLoading,
}) => {
	const [values, setValues] = useState(initialValues);
	const { name, description, template, isActive } = values;

	return (
		<div>
			<Box marginBottom={1.5}>
				<TextField
					value={name}
					onChange={(e) =>
						setValues({ ...values, name: e.target.value })
					}
					disabled={isLoading}
					autoFocus={true}
					placeholder="Group Title"
					className={useStyles({ variant: "h3" }).root}
				/>
			</Box>
			<Box marginBottom={1.5}>
				<TextField
					value={description}
					onChange={(e) =>
						setValues({ ...values, description: e.target.value })
					}
					disabled={isLoading}
					placeholder="Group Description (optional)"
					className={useStyles({ variant: "subtitle1" }).root}
				/>
			</Box>
			<FormControlLabel
				control={
					<Switch
						checked={isActive}
						onChange={(event) =>
							setValues({
								...values,
								isActive: event.target.checked,
							})
						}
					/>
				}
				disabled={isLoading}
				label="Is active?"
			/>
			<TemplateEditor
				template={template}
				handleChange={(template) => setValues({ ...values, template })}
				disabled={isLoading}
			/>
			<ActionButton
				Icon={DoneIcon}
				isLoading={isLoading}
				onClick={() => handleSubmit(values)}
			>
				{submitButtonText}
			</ActionButton>
		</div>
	);
};

const useStyles = makeStyles((theme) => ({
	root: (props) => ({
		"& .MuiInput-input": {
			...theme.typography[props.variant],
			height: "unset",
			"&::placeholder": {
				fontStyle: "italic",
			},
		},
		marginRight: theme.spacing(1),
		width: "100%",
	}),
}));

export default CouponGroupEditor;
