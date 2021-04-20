import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import DoneIcon from "@material-ui/icons/Done";
import ActionButton from "../components/action-button.component";
import FormLabel from "@material-ui/core/FormLabel";
import { styled } from "@material-ui/core/styles";
import wpRest from "../api/wp-rest";
import DurationInput from "../components/duration-input.component";

const SettingsPage = () => {
	const [isFetching, setFetching] = useState(true);
	const [isSaving, setSaving] = useState(false);
	const [options, setOptions] = useState({});

	const handleChange = (key) => (value) => {
		return setOptions((currentValues) => ({ ...currentValues, [key]: value }));
	};
	const handleSubmit = () => {
		setSaving(true);
		wpRest.setOptions(options).finally(() => setSaving(false));
	};

	useEffect(() => {
		wpRest
			.getOptions()
			.then(setOptions)
			.finally(() => setFetching(false));
	}, []);

	if (isFetching) return <CircularProgress />;

	return (
		<div>
			<Typography variant="h3" gutterBottom>
				Settings
			</Typography>
			<SettingsOption
				value={options.seconds_between_any_popup}
				handleChange={handleChange("seconds_between_any_popup")}
				label="Minimum seconds between any popups"
			/>
			<SettingsOption
				value={options.seconds_between_same_popup}
				handleChange={handleChange("seconds_between_same_popup")}
				label="Minimum seconds between popups of the same group"
			/>
			<SettingsOption
				value={options.seconds_between_any_retrieval}
				handleChange={handleChange("seconds_between_any_retrieval")}
				label="Minimum seconds between any coupon retrievals"
			/>
			<SettingsOption
				value={options.seconds_between_same_retrieval}
				handleChange={handleChange("seconds_between_same_retrieval")}
				label="Minimum seconds between retrievals of the same group"
			/>
			<SettingsOption
				value={options.seconds_valid_after_distribution}
				handleChange={handleChange("seconds_valid_after_distribution")}
				label="Minimum seconds of coupon validity"
			/>
			<ActionButton Icon={DoneIcon} isLoading={isSaving} onClick={handleSubmit}>
				Save options
			</ActionButton>
		</div>
	);
};

const SettingsOption = ({ label, value, handleChange }) => {
	return (
		<Label>
			<LabelText>{label}</LabelText>
			<DurationInput value={value} onChange={handleChange} />
		</Label>
	);
};

const Label = styled(FormLabel)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1, 3),
	marginBottom: theme.spacing(4),
	[theme.breakpoints.up("md")]: {
		flexDirection: "row",
		alignItems: "center",
	},
}));

const LabelText = styled("span")(({ theme }) => ({
	display: "inline-block",
	lineHeight: 1.5,
	[theme.breakpoints.up("md")]: {
		width: 300,
		textAlign: "right",
	},
}));

export default SettingsPage;
