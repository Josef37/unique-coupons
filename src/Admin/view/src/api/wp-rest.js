import _ from "lodash";

const WP_API = window.WP_COUPONS.api;

class WpRest {
	addGroup = async (couponGroup) => {
		const jsonResponse = await this.post(
			WP_API.group,
			this.transformGroupRequestBody(couponGroup)
		);
		return this.transformGroupResponse(jsonResponse);
	};

	addCoupons = async ({ couponValues, groupId, expiresAt }) => {
		const couponIds = await this.post(
			WP_API.addCoupons,
			this.transformAddCouponsRequestBody(
				groupId,
				couponValues,
				expiresAt
			)
		);
		return couponIds;
	};

	getGroups = async () => {
		const jsonResponse = await this.get(WP_API.group, {
			orderby: "id",
			order: "desc",
			per_page: 100,
		});
		return this.transformGroupsResponse(jsonResponse);
	};

	getCoupons = async (groupId) => {
		const jsonResponse = await this.get(WP_API.coupon, {
			per_page: 100,
			wp_coupon_group: groupId,
		});
		return this.transformGetCouponsResponse(jsonResponse);
	};

	editGroup = async (groupId, changes) => {
		const jsonResponse = await this.post(
			`${WP_API.group}/${groupId}`,
			this.transformGroupRequestBody(changes)
		);
		return this.transformGroupResponse(jsonResponse);
	};

	fetch = async (url, init) => {
		const response = await fetch(url, {
			...init,
			credentials:
				process.env.NODE_ENV === "development"
					? "include"
					: "same-origin",
			headers: {
				...init.headers,
				"Content-Type": "application/json",
				"X-WP-Nonce": WP_API.nonce,
			},
		});
		const jsonResponse = await response.json();
		if (!response.ok) {
			throw new Error(jsonResponse.message);
		}
		return jsonResponse;
	};
	get = async (url, paramsObj) => {
		const appendParams = (url, paramsObj) => {
			const params = new URLSearchParams(paramsObj);
			const paramsStr = params.toString();
			const delimiter = url.includes("?") ? "&" : "?";
			return paramsStr ? `${url}${delimiter}${paramsStr}` : url;
		};
		return this.fetch(appendParams(url, paramsObj), { method: "GET" });
	};
	post = async (url, bodyObj) => {
		return this.fetch(url, {
			method: "POST",
			body: JSON.stringify(bodyObj),
		});
	};

	transformGroupRequestBody = (couponGroup) => {
		const requestObj = {};
		if ("name" in couponGroup) _.set(requestObj, "name", couponGroup.name);
		if ("description" in couponGroup)
			_.set(requestObj, "description", couponGroup.description);
		if ("template" in couponGroup)
			_.set(requestObj, "meta.template", couponGroup.template);
		if ("isActive" in couponGroup)
			_.set(requestObj, "meta.is_active", couponGroup.isActive);
		return requestObj;
	};

	transformGroupResponse = (responseJson) => ({
		id: responseJson.id,
		name: responseJson.name,
		description: responseJson.description,
		template: responseJson.meta.template,
		isActive: responseJson.meta.is_active,
		couponIds: [],
	});

	transformGroupsResponse = (responseJson) => {
		return responseJson.map(this.transformGroupResponse);
	};

	transformAddCouponsRequestBody = (groupId, couponValues, expiresAt) => ({
		group_id: groupId,
		coupon_values: couponValues,
		expires_at: expiresAt,
	});

	transformGetCouponsResponse = (responseJson) => {
		return responseJson.map((coupon) => ({
			id: coupon.id,
			value: coupon.title.rendered,
			expiresAt: coupon.meta.expires_at,
			status: coupon.status,
			userId: coupon.meta.user_id,
		}));
	};
}

export default new WpRest();
