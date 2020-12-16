const WP_API = window.WP_COUPONS.api

class WpRest {
	addGroup = async (couponGroup) => {
		const jsonResponse = await this.post(
			WP_API.group,
			this.transformNewGroupRequestBody(couponGroup)
		)
		return this.transformNewGroupResponse(jsonResponse)
	}

	addCoupons = async ({ couponValues, groupId, expiresAt }) => {
		const couponIds = await this.post(
			WP_API.addCoupons,
			this.transformAddCouponsRequestBody(groupId, couponValues, expiresAt)
		)
		return couponIds
	}

	fetch = async (url, method, body) => {
		const response = await fetch(
			url,
			{
				method,
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': WP_API.nonce
				},
				body: JSON.stringify(body)
			}
		)
		const jsonResponse = await response.json()
		if (!response.ok) {
			throw new Error(jsonResponse.message)
		}
		return jsonResponse
	}
	get = async (url, body) => this.fetch(url, 'GET', body)
	post = async (url, body) => this.fetch(url, 'POST', body)

	transformNewGroupRequestBody = (couponGroup) => {
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
	transformNewGroupResponse = (responseJson) => ({
		id: responseJson.id,
		name: responseJson.name,
		description: responseJson.description,
		template: responseJson.meta.template,
		isActive: responseJson.meta.is_active,
		couponIds: []
	})

	transformAddCouponsRequestBody = (groupId, couponValues, expiresAt) => ({
		group_id: groupId,
		coupon_values: couponValues,
		expires_at: expiresAt
	})
}

export default new WpRest()
