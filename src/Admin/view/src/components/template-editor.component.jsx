import React from 'react';
import Box from '@material-ui/core/Box';

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';
import { Editor } from '@tinymce/tinymce-react';

const TemplateEditor = ({ template, handleChange, editorProps }) => {
	return <Box marginY={2}>
		<Editor
			init={{
				height: 300,
				menubar: false,
				plugins: 'paste link image',
				toolbar: 'undo redo | formatselect | bold italic backcolor | '
					+ 'alignleft aligncenter alignright alignjustify | '
					+ 'bullist numlist outdent indent | removeformat | help',
				branding: false,
			}}
			value={template}
			onEditorChange={(content, editor) => handleChange(content)}
			{...editorProps}
		/>
	</Box>
}

export default TemplateEditor
