import React, { useState } from 'react';
import TemplateEditor from '../components/template-editor.component';
import CouponsList from '../components/coupons-list.component';

import data from "../data"

const CouponGroup = ({ groupId }) => {
	const { name, description, isActive } = data.couponGroups[groupId]

	return <div>
		{/** @todo make editable */}
		<h2>{name}</h2>
		<p>{description}</p>
		<div>
			<label>Is active?
			<input type="checkbox" checked={isActive} onChange={() => console.log("I should toggle")} />
			</label>
		</div>
		<TemplateEditor groupId={groupId} />
		<CouponsList groupId={groupId} />
	</div>;
}

export default CouponGroup;
