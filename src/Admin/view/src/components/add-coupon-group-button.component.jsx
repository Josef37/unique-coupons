import React from 'react'
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles'

const AddCouponGroupButton = () => {
	const classes = useStyles()

	return <Fab
		component={Link}
		to="/add-coupon-group"
		color="primary"
		variant="extended"
		aria-label="add new coupon group"
	>
		<AddIcon className={classes.extendedIcon} />
		Add a new coupon group
	</Fab>
}

const useStyles = makeStyles(theme => ({
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}))

export default AddCouponGroupButton;
