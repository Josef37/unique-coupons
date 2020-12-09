class WpRest {
	addGroup = async (couponGroup) => {
		const response = await this.post(
			window.WP_COUPONS.api.group,
			this.transformNewGroupRequestBody(couponGroup)
		)
		const responseJson = await response.json()
		if (!response.ok) {
			throw new Error(responseJson.message)
		}
		return this.transformNewGroupResponse(responseJson)
	}

	addCoupons = async (coupons) => {

	}

	fetch = async (url, method, body) => {
		return fetch(
			url,
			{
				method,
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window.WP_COUPONS.api.nonce
				},
				body: JSON.stringify(body)
			}
		)
	}
	get = async (url, body) => fetch(url, 'GET', body)
	post = async (url, body) => fetch(url, 'POST', body)

	transformNewGroupRequestBody = couponGroup => {
		const { name, description, template, isActive } = couponGroup
		return {
			name,
			description,
			meta: {
				template,
				is_active: isActive
			}
		}
	}
	transformNewGroupResponse = (responseJson) => {
		const {
			id,
			name,
			description,
			meta: {
				template,
				is_active: isActive
			}
		} = responseJson
		return { id, name, description, template, isActive, couponIds: [] }
	}
}

export default WpRest
