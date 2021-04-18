(function($) {
	window.addEventListener("DOMContentLoaded", (event) => {
		const popupElement = document.querySelector(".wp-coupons-popup");
		new Popup(popupElement);
	});

	class Popup {
		elements = {};
		groupId;
		canFetch;

		constructor(element) {
			this.elements.container = element;
			this.init();
		}

		init = () => {
			this.groupId = this.elements.container.dataset.groupId;
			if (!this.groupId) return;

			this.selectDomElements();
			this.hideSuccessArea();
			this.setCanFetch(true);
			this.addButtonListener();
			this.queuePopup();
		};

		selectDomElements = () => {
			[
				{ name: "button", selector: ".wp-coupons-popup__button" },
				{ name: "coupon", selector: ".wp-coupons-popup__coupon" },
				{ name: "value", selector: ".wp-coupons-popup__value" },
				{ name: "expiresAt", selector: ".wp-coupons-popup__expires-at" },
			].forEach(({ name, selector }) => {
				this.elements[name] = this.elements.container.querySelector(selector);
			});
		};

		hideSuccessArea = () => {
			this.elements.coupon.style.display = "none";
		};

		addButtonListener = () => {
			this.elements.button.addEventListener("click", () =>
				this.handleRetrieval()
			);
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
				$(this.elements.container).modal();
			}, wpCouponsPopup.timeoutInMs);
		};

		setCanFetch(canFetch) {
			this.canFetch = canFetch;
			this.elements.button.disabled = !canFetch;
			this.elements.button.style.cursor = canFetch ? "pointer" : "default";
		}
	}
})(jQuery);
