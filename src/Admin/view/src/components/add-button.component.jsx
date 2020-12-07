import React from 'react'
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import { Link } from "react-router-dom"
import { makeStyles } from '@material-ui/core/styles'

const AddButton = ({ to, label, children }) => {
	const classes = useStyles()

	return <Fab
		component={Link}
		to={to}
		color="primary"
		variant="extended"
		aria-label={label}
	>
		<AddIcon className={classes.extendedIcon} />
		{children}
	</Fab>
}

const useStyles = makeStyles(theme => ({
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}))

export default AddButton;
