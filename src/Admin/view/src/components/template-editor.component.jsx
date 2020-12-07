import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCouponGroupById, updateGroupTemplate } from "../redux/coupons.slice";

const TemplateEditor = ({ groupId }) => {
	const { template } = useSelector(state => selectCouponGroupById(state, groupId))
	const dispatch = useDispatch()

	return <div>
		<h3>Template Editor</h3>
		<textarea value={template} onChange={e => dispatch(updateGroupTemplate({ groupId, template: e.target.value }))} />
	</div>;
}

export default TemplateEditor;
