import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from "@material-ui/icons/Add"
import { selectCouponGroupById, editGroup, getCoupons } from "../redux/coupons.slice";
import TemplateEditor from '../components/template-editor.component';
import CouponLists from '../components/coupon-lists.component';
import EditText from '../components/edit-text.component';
import ActionButton from '../components/action-button.component';
import Typography from '@material-ui/core/Typography';
import { unwrapResult } from '@reduxjs/toolkit';

const CouponGroupPage = ({ groupId }) => {
	const group = useSelector(state => selectCouponGroupById(state, groupId))
	const isValidGroupId = undefined !== group
	const [isFetching, setFetching] = useState(true)
	const [error, setError] = useState("")
	const dispatch = useDispatch()
	React.useEffect(() => {
		if (isValidGroupId) {
			dispatch(getCoupons(groupId))
				.then(unwrapResult)
				.then(() => setFetching(false))
				.catch(({ message }) => setError(message))
		}
	}, [dispatch, isValidGroupId, groupId])

	if (!isValidGroupId) {
		return <Typography variant="body1">There is no group with ID {groupId}</Typography>
	}
	const { name, description, template, isActive } = group
	return <div>
		<EditText
			variant="h3"
			text={name}
			placeholder="Group Title"
			onEditDone={name => dispatch(editGroup({ groupId, name }))}
		/>
		<EditText
			variant="subtitle1"
			text={description}
			placeholder="Group Description (optional)"
			onEditDone={description => dispatch(editGroup({ groupId, description }))}
		/>
		<FormControlLabel
			control={<Switch
				checked={isActive}
				onChange={() => dispatch(editGroup({ groupId, isActive: !isActive }))}
			/>}
			label="Is active?"
		/>
		<TemplateEditor
			template={template}
			handleChange={template => dispatch(editGroup({ groupId, template }))}
		/>
		<CouponLists
			groupId={groupId}
			isFetching={isFetching}
		/>
		<ActionButton component={Link} to={`/add-coupons/${groupId}`} Icon={AddIcon}>Add coupons to this group</ActionButton>
	</div>;
}

export default CouponGroupPage;
