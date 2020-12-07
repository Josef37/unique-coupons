import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom"
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from "@material-ui/icons/Add"
import { selectCouponGroupById, editGroup } from "../redux/coupons.slice";
import TemplateEditor from '../components/template-editor.component';
import CouponsList from '../components/coupons-list.component';
import EditText from '../components/edit-text.component';
import ActionButton from '../components/action-button.component';

const CouponGroupPage = ({ groupId }) => {
	const { name, description, template, isActive } = useSelector(state => selectCouponGroupById(state, groupId))
	const dispatch = useDispatch()

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
		<CouponsList groupId={groupId} />
		<ActionButton component={Link} to={`/add-coupons/${groupId}`} Icon={AddIcon}>Add coupons to this group</ActionButton>
	</div>;
}

export default CouponGroupPage;
