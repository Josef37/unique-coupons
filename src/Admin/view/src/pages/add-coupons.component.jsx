import React, { useState } from 'react';
import _ from 'lodash'
import { format, isMatch } from "date-fns"
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { useHistory } from 'react-router-dom';
import AddIcon from "@material-ui/icons/Add";
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';
import { addCoupons, selectCouponGroupById } from '../redux/coupons.slice';
import ActionButton from '../components/action-button.component';
import BackLink from '../components/back-link.component';

const todaysDateString = format(new Date(), "yyyy-MM-dd")

const AddCouponsPage = ({ groupId }) => {
	const { name: groupName } = useSelector(state => selectCouponGroupById(state, groupId))
	const [expiresAtInput, setExpiresAtInput] = useState(todaysDateString)
	const [couponsInput, setCouponsInput] = useState("")
	const [error, setError] = useState("")
	const [isFetching, setFetching] = useState(false)
	const dispatch = useDispatch()
	const history = useHistory()

	const handleAdd = () => {
		if (!couponsInput || !expiresAtInput) {
			setError('Fill all inputs first.')
			return
		}
		if (!isMatch(expiresAtInput, 'yyyy-MM-dd')) {
			setError(`Format the date input like ${todaysDateString}`)
			return
		}
		const couponValues = _.words(couponsInput)
		const expiresAt = expiresAtInput

		setFetching(true)
		dispatch(addCoupons({ couponValues, expiresAt, groupId }))
			.then(unwrapResult)
			.then(() => history.push(`/group/${groupId}`))
			.catch(({ message }) => setError(message))
			.finally(() => setFetching(false))
	}

	return <div>
		<BackLink to={`/group/${groupId}`}>Back to Group "{groupName}"</BackLink>
		<Typography
			variant="h3"
			gutterBottom
		>
			Add Coupons to Group "{groupName}"
		</Typography>
		<Label>
			<span>Expires at</span>
			<TextField
				type="date"
				value={expiresAtInput}
				autoFocus
				required
				variant="outlined"
				placeholder={`Format like ${todaysDateString}`}
				inputProps={{ min: todaysDateString }}
				onChange={e => setExpiresAtInput(e.target.value)}
			/>
		</Label>
		<Label>
			<span>Coupons</span>
			<TextField
				value={couponsInput}
				multiline
				required
				variant="outlined"
				rows="4"
				rowsMax="16"
				helperText="Separated by whitespace"
				onChange={e => setCouponsInput(e.target.value)}
			/>
		</Label>
		<ActionButton
			Icon={AddIcon}
			isLoading={isFetching}
			onClick={handleAdd}
		>
			Add coupons
		</ActionButton>
		<Snackbar
			open={!!error}
			autoHideDuration={6000}
			message={error}
			onClose={(event, reason) => reason === "clickaway" || setError("")}
		/>
	</div>
}

const Label = styled("label")(({ theme }) => ({
	display: "flex",
	marginBottom: theme.spacing(3),
	'& > *': { flexBasis: 200 }
}))

export default AddCouponsPage;
