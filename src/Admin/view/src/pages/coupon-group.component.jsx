import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectCouponGroupById, editGroup } from "../redux/coupons.slice";
import { Link } from "react-router-dom";
import TemplateEditor from '../components/template-editor.component';
import CouponsList from '../components/coupons-list.component';
import EditText from '../components/edit-text.component';

const CouponGroup = ({ groupId }) => {
	const { name, description, isActive } = useSelector(state => selectCouponGroupById(state, groupId))
	const dispatch = useDispatch()

	return <div>
		<EditText variant="h3" text={name} onEditDone={name => dispatch(editGroup({ groupId, name }))} />
		<EditText variant="subtitle1" text={description} onEditDone={description => dispatch(editGroup({ groupId, description }))} />
		<div>
			<label>
				Is active?
				<input type="checkbox" checked={isActive} onChange={() => console.log("I should toggle")} />
			</label>
		</div>
		<TemplateEditor groupId={groupId} />
		<CouponsList groupId={groupId} />
		<Link to={`/add-coupons/${groupId}`}>Add Coupons</Link>
	</div>;
}

export default CouponGroup;
