const wpRestFetch = async (url, method, body) => {
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
const wpRestGet = async (url, body) => wpRestFetch(url, 'GET', body)
const wpRestPost = async (url, body) => wpRestFetch(url, 'POST', body)

export const addGroup = async (couponGroup) => {
	const response = await wpRestPost(
		window.WP_COUPONS.api.group,
		transformNewGroupRequestBody(couponGroup)
	)
	const responseJson = await response.json()
	if (!response.ok) {
		throw new Error(responseJson.message)
	}
	return transformNewGroupResponse(responseJson)
}

const transformNewGroupRequestBody = couponGroup => {
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

const transformNewGroupResponse = (responseJson) => {
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
