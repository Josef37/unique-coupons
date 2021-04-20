import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormLabel from "@material-ui/core/FormLabel";
import { styled } from "@material-ui/core/styles";

const DurationInput = ({ value, onChange }) => {
	const values = valuesFromSeconds(value);
	const { days, hours, minutes, seconds } = values;

	const handleChange = (key) => (event) => {
		onChange(
			valuesToSeconds({
				days,
				hours,
				minutes,
				seconds,
				[key]: Number(event.target.value),
			})
		);
	};

	const makeNumberInput = (key) => (
		<FormLabel>
			<NumberInput
				type="number"
				value={values[key]}
				onChange={handleChange(key)}
			/>
			{key}
		</FormLabel>
	);

	return (
		<Container>
			{makeNumberInput("days")}
			{makeNumberInput("hours")}
			{makeNumberInput("minutes")}
			{makeNumberInput("seconds")}
		</Container>
	);
};

const Container = styled("div")(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(0.5, 2),
	[theme.breakpoints.down("xs")]: {
		flexDirection: "column",
	},
}));

const NumberInput = styled(OutlinedInput)(({ theme }) => ({
	width: "4rem",
	marginRight: theme.spacing(1),
	"& .MuiOutlinedInput-input": {
		padding: theme.spacing(1),
	},
}));

const valuesFromSeconds = (input) => {
	const seconds = input % 60;
	input = Math.floor(input / 60);

	const minutes = input % 60;
	input = Math.floor(input / 60);

	const hours = input % 24;
	input = Math.floor(input / 24);

	const days = input;

	return { days, hours, minutes, seconds };
};

const valuesToSeconds = ({ days, hours, minutes, seconds }) => {
	return ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
};

export default DurationInput;
