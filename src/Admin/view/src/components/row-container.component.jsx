import { styled } from "@material-ui/core/styles";

const RowContainer = styled("div")({
	padding: "1em",
	"&:not(:last-of-type)": {
		borderBottom: "1px solid #ccc",
	},
	"&:hover": {
		background: "#eee",
	},
});

export default RowContainer;
