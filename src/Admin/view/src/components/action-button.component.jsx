import React from 'react'
import Fab from "@material-ui/core/Fab"
import { makeStyles } from '@material-ui/core/styles'

const ActionButton = ({ children, Icon, ...other }) => {
	const classes = useStyles()

	return <Fab
		color="primary"
		variant="extended"
		{...other}
	>
		<Icon className={classes.extendedIcon} />
		{children}
	</Fab>
}

const useStyles = makeStyles(theme => ({
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}))

export default ActionButton;
