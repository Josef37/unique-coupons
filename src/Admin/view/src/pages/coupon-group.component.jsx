import React from 'react';
import { useSelector } from "react-redux";
import { selectCouponGroupById } from "../redux/coupons.slice";
import { Link } from "react-router-dom";
import TemplateEditor from '../components/template-editor.component';
import CouponsList from '../components/coupons-list.component';

const CouponGroup = ({ groupId }) => {
	const { name, description, isActive } = useSelector(state => selectCouponGroupById(state, groupId))

	return <div>
		{/** @todo make editable */}
		<h2>{name}</h2>
		<p>{description}</p>
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
