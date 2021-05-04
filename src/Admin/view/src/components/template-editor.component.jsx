import React from "react";
import Box from "@material-ui/core/Box";
import { Editor } from "@tinymce/tinymce-react";

import "tinymce/tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/skins/content/default/content.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/ui/oxide/skin.min.css";

import "tinymce/plugins/autoresize";
import "tinymce/plugins/code";
import "tinymce/plugins/help";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/paste";

const TemplateEditor = ({ template, handleChange, ...editorProps }) => (
	<Box marginY={2}>
		<Editor
			init={{
				height: 300,
				plugins: "paste link image template code autoresize help lists",
				toolbar: [
					"undo redo | styleselect | bold italic | link image | alignleft aligncenter alignright alignjustify | outdent indent | code | help",
					"actionButton successArea couponValue expiresAt",
				],
				content_style,
				branding: false,
				formats: {
					successArea: {
						block: "div",
						classes: "wp-coupons-popup__coupon",
					},
					couponValue: {
						inline: "span",
						classes: "wp-coupons-popup__value",
					},
					expiresAt: {
						inline: "span",
						classes: "wp-coupons-popup__expires-at",
					},
					actionButton: {
						inline: "button",
						classes: "wp-coupons-popup__button",
					},
				},
				setup: (editor) => {
					editor.ui.registry.addButton("couponValue", {
						text: "Coupon value",
						onAction: () => editor.formatter.toggle("couponValue"),
					});
					editor.ui.registry.addButton("expiresAt", {
						text: "Expiry date",
						onAction: () => editor.formatter.toggle("expiresAt"),
					});
					editor.ui.registry.addButton("successArea", {
						text: "Success area",
						onAction: () => editor.formatter.toggle("successArea"),
					});
					editor.ui.registry.addButton("actionButton", {
						text: "Action button",
						onAction: () => editor.formatter.toggle("actionButton"),
					});
				},
			}}
			value={template}
			onEditorChange={(content, editor) => handleChange(content)}
			{...editorProps}
		/>
	</Box>
);

const highlightColor = "#666";
const content_style = `
	[class^="wp-coupons-popup__"] {
		position: relative;
		border: 1px dashed ${highlightColor};
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
		font-size: 90%;
		color: ${highlightColor};
		background-color: white;
		opacity: 0;
		transition: opacity 0.2s;
		padding: 2px 4px;
		border-radius: 4px;
		box-shadow: 2px 2px 4px;
	}
	[class^="wp-coupons-popup__"]:hover::after {
		opacity: 1;
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
`;

export default TemplateEditor;
