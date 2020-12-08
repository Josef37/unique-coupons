import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Snackbar from '@material-ui/core/Snackbar';
import DoneIcon from '@material-ui/icons/Done';
import EditText from '../components/edit-text.component';
import ActionButton from '../components/action-button.component';
import { addGroup } from '../redux/coupons.slice';
import TemplateEditor from '../components/template-editor.component';

const AddCouponGroupPage = () => {
	const [input, setInput] = useState({
		name: "",
		description: "",
		template: "",
		isActive: true,
	})
	const { name, description, template, isActive } = input
	const dispatch = useDispatch()
	const history = useHistory()
	const [error, setError] = useState("")
	const [isFetching, setFetching] = useState(false)

	const handleAdd = () => {
		if (!name) {
			setError('Name is empty. Accept changes first.');
			return;
		}
		setFetching(true);
		dispatch(addGroup(input))
			.then(unwrapResult)
			.then(({ id }) => history.push(`/group/${id}`))
			.catch(({ message }) => setError(message))
			.finally(() => setFetching(false));
	}

	return <div>
		<EditText
			isEditingInitially
			variant="h3"
			text={name}
			placeholder="Group Title"
			onEditDone={name => setInput({ ...input, name })}
		/>
		<EditText
			isEditingInitially={true}
			variant="subtitle1"
			text={description}
			placeholder="Group Description (optional)"
			onEditDone={description => setInput({ ...input, description })}
		/>
		<FormControlLabel
			control={<Switch
				checked={isActive}
				onChange={() => setInput({ ...input, isActive: !isActive })}
			/>}
			label="Is active?"
		/>
		<TemplateEditor
			template={template}
			handleChange={template => setInput({ ...input, template })}
		/>
		<ActionButton
			Icon={DoneIcon}
			isLoading={isFetching}
			onClick={handleAdd}
		>
			Add this coupon group
		</ActionButton>
		<Snackbar
			open={!!error}
			autoHideDuration={6000}
			message={error}
			onClose={(event, reason) => reason === "clickaway" || setError("")}
		/>
	</div>;
}

export default AddCouponGroupPage;
