import React, { useCallback, useState } from 'react';
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import DoneIcon from '@material-ui/icons/DoneRounded';
import CancelIcon from '@material-ui/icons/ClearRounded';
import EditIcon from '@material-ui/icons/EditRounded';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const EditText = ({ text: initialText, onEditDone, variant }) => {
	const [text, setText] = useState(initialText)
	const [isEditing, setEditing] = useState(false)
	const classes = useStyles({ variant })

	const acceptEdit = useCallback(() => {
		setEditing(false)
		onEditDone(text)
	}, [onEditDone, text])

	const cancelEdit = useCallback(() => {
		setEditing(false);
		setText(initialText)
	}, [initialText])

	const cancelEditOnEscape = useCallback(e => {
		"Escape" === e.key &&
			cancelEdit()
	}, [cancelEdit])

	const startEditing = useCallback(() => setEditing(true), [])

	if (isEditing) {
		return <form
			onSubmit={acceptEdit}
			onReset={cancelEdit}
			onKeyDown={cancelEditOnEscape}
		>
			<Container>
				<TextField
					value={text}
					onChange={e => setText(e.target.value)}
					autoFocus
					className={classes.root}
				/>
				<IconButton
					type="submit"
					aria-label="accept changes"
				>
					<DoneIcon />
				</IconButton>
				<IconButton
					type="reset"
					aria-label="discard changes"
				>
					<CancelIcon />
				</IconButton>
			</Container>
		</form>
	} else {
		return <Container>
			<Typography variant={variant} className={classes.text}>{text}</Typography>
			<IconButton
				onClick={startEditing}
				aria-label="edit text"
			>
				<EditIcon />
			</IconButton>
		</Container>
	}
}

const Container = (props) =>
	<Box
		display="flex"
		alignItems="center"
		marginBottom={1}
		{...props}
	/>

const useStyles = makeStyles(theme => ({
	root: props => ({
		'& .MuiInput-input': {
			...theme.typography[props.variant],
			height: 'unset'
		},
		marginRight: theme.spacing(1),
		width: "100%"
	}),
	text: {
		padding: `7px 0 8px`,
		marginRight: theme.spacing(1)
	}
}))

export default EditText;
