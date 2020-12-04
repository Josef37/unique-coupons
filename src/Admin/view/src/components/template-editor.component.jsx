import React from 'react';

import data from "../data"

const TemplateEditor = ({ groupId }) => {
	const template = data.couponGroups[groupId].template

	return <div>
		<h3>Template Editor</h3>
		<textarea value={template} onChange={e => console.log(`My new value is "${e.target.value}"`)} />
	</div>;
}

export default TemplateEditor;
