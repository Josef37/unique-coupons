import React from 'react';
import ActivationToggle from '../components/activation-toggle.component';
import TemplateEditor from '../components/template-editor.component';
import CouponsList from '../components/coupons-list.component';

const CouponGroup = () => {
	return <div>
		<h2>Coupon Group</h2>
		<ActivationToggle />
		<TemplateEditor />
		<CouponsList />
	</div>;
}

export default CouponGroup;
