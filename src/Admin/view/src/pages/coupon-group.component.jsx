import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { selectCouponGroupById, editGroup } from "../redux/coupons.slice";
import TemplateEditor from '../components/template-editor.component';
import CouponsList from '../components/coupons-list.component';
import EditText from '../components/edit-text.component';

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
			control={<Checkbox
				checked={isActive}
				onChange={e => dispatch(editGroup({ groupId, isActive: e.target.checked }))}
			/>}
			label="Is active?"
		/>
		<TemplateEditor groupId={groupId} />
		<CouponsList groupId={groupId} />
		<Link to={`/add-coupons/${groupId}`}>Add Coupons</Link>
	</div>;
}

export default CouponGroupPage;
