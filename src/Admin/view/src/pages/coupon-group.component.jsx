import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { selectCouponGroupById, editGroup } from "../redux/coupons.slice";
import TemplateEditor from '../components/template-editor.component';
import CouponsList from '../components/coupons-list.component';
import EditText from '../components/edit-text.component';
import AddButton from '../components/add-button.component';

const CouponGroupPage = ({ groupId }) => {
	const { name, description, isActive } = useSelector(state => selectCouponGroupById(state, groupId))
	const dispatch = useDispatch()

	return <div>
		<EditText
			variant="h3"
			text={name}
			onEditDone={name => dispatch(editGroup({ groupId, name }))}
		/>
		<EditText
			variant="subtitle1"
			text={description}
			onEditDone={description => dispatch(editGroup({ groupId, description }))}
		/>
		<FormControlLabel
			control={<Switch
				checked={isActive}
				onChange={() => dispatch(editGroup({ groupId, isActive: !isActive }))}
			/>}
			label="Is active?"
		/>
		<TemplateEditor groupId={groupId} />
		<CouponsList groupId={groupId} />
		<AddButton to={`/add-coupons/${groupId}`} label="add coupons to this group">Add coupons to this group</AddButton>
	</div>;
}

export default CouponGroupPage;
