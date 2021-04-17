/**
@todo
Responsible for
- Displaying the popup
- Retrieving the coupon from the backend
- Displaying the coupon after retrieval

Maybe add all selectors and stuff into localization
*/

{
	window.addEventListener("DOMContentLoaded", (event) => {
		const popupElement = document.querySelector(".wp-coupons-popup");
		new Popup(popupElement);
	});

	class Popup {
		elements = {};
		groupId;
		canFetch = true;

		constructor(element) {
			this.elements.container = element;
			this.init();
		}

		init = () => {
			this.groupId = this.elements.container.dataset.groupId;
			if (!this.groupId) return;

			this.selectDomElements();
			this.addButtonListeners();
			this.queuePopup();
		};

		selectDomElements = () => {
			this.elements.buttons = this.elements.container.querySelectorAll(
				".wp-coupons-popup__button"
			);
			this.elements.coupon = this.elements.container.querySelector(
				".wp-coupons-popup__coupon"
			);
			this.elements.value = this.elements.container.querySelector(
				".wp-coupons-popup__value"
			);
			this.elements.expiresAt = this.elements.container.querySelector(
				".wp-coupons-popup__expires_at"
			);
		};

		addButtonListeners = () => {
			this.elements.buttons.forEach((button) => {
				button.addEventListener("click", () => this.handleRetrieval());
			});
		};

		handleRetrieval = () => {
			if (!this.canFetch) return;
			this.setCanFetch(false);

			this.fetchCoupon()
				.then(this.checkResponseStatus)
				.then((response) => response.json())
				.then(this.showCoupon)
				.catch(this.handleResponseError);
		};

		fetchCoupon = () => {
			return fetch(wpCouponsPopup.api.retrieveCoupon, {
				method: "POST",
				body: JSON.stringify({
					group_id: this.groupId,
				}),
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": wpCouponsPopup.api.nonce,
				},
			});
		};

		checkResponseStatus = (response) => {
			if (response.ok) return response;
			throw new Error("Response not ok");
		};

		showCoupon = ({ value, expires_at }) => {
			this.elements.coupon.style.display = "block";
			this.elements.value.textContent = value;
			this.elements.expiresAt.textContent = expires_at;
		};

		handleResponseError = () => {
			this.setCanFetch(true);
		};

		queuePopup = () => {
			setTimeout(() => {
				this.elements.container.style.display = "block";
			}, wpCouponsPopup.timeoutInMs);
		};

		setCanFetch(canFetch) {
			this.canFetch = canFetch;
			this.elements.buttons.forEach((button) => {
				button.disabled = !canFetch;
			});
		}
	}
}
