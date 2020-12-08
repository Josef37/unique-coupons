import React from 'react'
import Fab from "@material-ui/core/Fab"
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles'

const ActionButton = ({ children, Icon, isLoading, ...other }) => {
	const classes = useStyles()

	return <Fab
		color="primary"
		variant="extended"
		disabled={isLoading}
		{...other}
	>
		<Icon className={classes.extendedIcon} />
		{children}
		{isLoading && <CircularProgress size={28} className={classes.progress} />}
	</Fab>
}

const useStyles = makeStyles(theme => ({
	extendedIcon: {
		marginRight: theme.spacing(1)
	},
	progress: {
		position: 'absolute',
		top: '50%',
		left: 14,
		marginTop: -14,
	}
}))

export default ActionButton;
