import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCouponGroupById, editGroup } from "../redux/coupons.slice";

const TemplateEditor = ({ groupId }) => {
	const { template } = useSelector(state => selectCouponGroupById(state, groupId))
	const dispatch = useDispatch()

	return <div>
		<h3>Template Editor</h3>
		<textarea value={template} onChange={e => dispatch(editGroup({ groupId, template: e.target.value }))} />
	</div>;
}

export default TemplateEditor;
