import React, { useCallback, useState } from 'react';
import _ from 'lodash'
import { parseISO } from "date-fns";
import { useDispatch } from 'react-redux';
import { addCoupons } from '../redux/coupons.slice';
import { nanoid } from '@reduxjs/toolkit';

const AddCoupons = ({ groupId }) => {
	const dispatch = useDispatch()
	const [expiresAtInput, setExpiresAtInput] = useState()
	const [couponsInput, setCouponsInput] = useState("")

	const handleSubmit = useCallback(event => {
		event.preventDefault()
		const coupons = _.words(couponsInput).map(couponValue => ({
			id: nanoid(),
			value: couponValue,
			expiresAt: parseISO(expiresAtInput).valueOf()
		}))
		dispatch(addCoupons({ groupId, coupons }))
	}, [couponsInput, dispatch, expiresAtInput, groupId])

	return <div>
		<h2>Add Coupons to Group {groupId}</h2>
		<form onSubmit={handleSubmit}>
			<label>
				Expires at
				<input type="date" value={expiresAtInput} onChange={e => setExpiresAtInput(e.target.value)} />
			</label>
			<label>
				Coupons (separated by whitespace)
				<textarea value={couponsInput} onChange={e => setCouponsInput(e.target.value)} />
			</label>
			<button>Add Coupons</button>
		</form>
	</div>;
}

export default AddCoupons;
