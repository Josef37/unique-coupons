import React from 'react';
import Box from '@material-ui/core/Box';
import { Editor } from '@tinymce/tinymce-react';

import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
import 'tinymce/skins/content/default/content.min.css';

import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/template';
import 'tinymce/plugins/code';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/template';
import 'tinymce/plugins/help';

const TemplateEditor = ({ template, handleChange, ...editorProps }) => (
	<Box marginY={2}>
		<Editor
			init={{
				height: 300,
				plugins: 'paste link image template code autoresize help lists template',
				formats: {
					coupon: { inline: 'button', classes: 'wp-coupons-popup__coupon' },
					value: { inline: 'span', classes: 'wp-coupons-popup__value' },
					expiresAt: { inline: 'span', classes: 'wp-coupons-popup__expires-at' },
					button: { block: 'div', classes: 'wp-coupons-popup__button' },
				},
				style_formats: [
					{ title: 'Action area', format: 'button' },
					{ title: 'Success area', format: 'coupon' },
					{ title: 'Coupon value (will be overwritten)', format: 'value' },
					{ title: 'Expiry date (will be overwritten)', format: 'expiresAt' },
				],
				content_style,
				branding: false,
			}}
			value={template}
			onEditorChange={(content, editor) => handleChange(content)}
			{...editorProps}
		/>
	</Box>
)

const highlightColor = '#999999'
const content_style = `
	[class^="wp-coupons-popup__"] {
		position: relative;
		border: 1px solid ${highlightColor};
	}
	.wp-coupons-popup__coupon {
		padding-top: 0.5em;
	}
	[class^="wp-coupons-popup__"]::after {
		position: absolute;
		width: max-content;
		top: 0;
		left: 50%;
		transform: translate(-50%, -75%);
		font-size: 60%;
		color: ${highlightColor};
		background-color: white;
	}
	.wp-coupons-popup__button::after {
		content: "Action area";
	}
	.wp-coupons-popup__coupon::after {
		content: "Success area";
	}
	.wp-coupons-popup__value::after {
		content: "Coupon value";
	}
	.wp-coupons-popup__expires-at::after {
		content: "Expiry date";
	}
`

export default TemplateEditor
