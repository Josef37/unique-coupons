import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { styled } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import MuiDialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import {
	selectCouponGroupById,
	editGroup,
	deleteGroup,
} from "../redux/coupons.slice";
import { appRoot } from "../configure-shadow-dom";

const CouponGroupRow = ({ groupId }) => {
	const { id, name, description, isActive } = useSelector((state) =>
		selectCouponGroupById(state, groupId)
	);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const openDialog = () => setDialogOpen(true);
	const closeDialog = () => setDialogOpen(false);

	const dispatch = useDispatch();
	const handleIsActiveChange = (isActive) =>
		dispatch(editGroup({ groupId, isActive }));
	const handleDelete = () => dispatch(deleteGroup(groupId)).then(closeDialog);

	return (
		<Row>
			<Switch
				checked={isActive}
				onChange={(event) => handleIsActiveChange(event.target.checked)}
				inputProps={{ "aria-label": "toggle group activation" }}
			/>
			<Box>
				<Link to={`/group/${id}`}>
					<Title>{name}</Title>
				</Link>
				<Description>{description}</Description>
			</Box>
			<DeleteButton onClick={openDialog} />
			<Dialog open={isDialogOpen} onClose={closeDialog} container={appRoot}>
				<DialogTitle>Delete this coupon group?</DialogTitle>
				<DialogContent>
					<DialogContentText>This action can't be undone.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDialog}>Cancel</Button>
					<Button color="primary" onClick={handleDelete}>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Row>
	);
};

const Row = styled("div")({
	display: "flex",
	alignItems: "center",
	gap: "1em",
});
const Title = styled("h3")({
	margin: 0,
});
const Description = styled("span")({
	fontStyle: "italic",
});
const DeleteButton = styled((props) => (
	<IconButton aria-label="delete group" {...props}>
		<DeleteIcon />
	</IconButton>
))({ marginLeft: "auto" });
const Dialog = styled(MuiDialog)(({ theme }) => ({
	"& .MuiDialog-paper": { padding: theme.spacing(0.5, 1) },
}));

export default CouponGroupRow;
