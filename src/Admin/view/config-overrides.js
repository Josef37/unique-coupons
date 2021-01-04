const customStyleLoader = {
	loader: require.resolve('style-loader'),
	options: {
		insert: function (linkTag) {
			document
				.querySelector('#wp-coupons-root')
				.shadowRoot
				.appendChild(linkTag)
		},
	},
}

module.exports = function override(config, env) {
	config.module.rules[1].oneOf.forEach(option => {
		if (option?.test?.source?.includes("css")) {
			option.use.splice(0, 1, customStyleLoader)
		}
	})
	return config
}
