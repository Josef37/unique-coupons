import React from 'react';
import Box from '@material-ui/core/Box';

const TemplateEditor = ({ template, handleChange }) => {
	return <Box marginBottom={2}>
		<h3>Template Editor</h3>
		<textarea value={template} onChange={e => handleChange(e.target.value)} />
	</Box>;
}

export default TemplateEditor
