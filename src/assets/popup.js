(function ($) {
	window.addEventListener("DOMContentLoaded", (event) => {
		const popupElement = document.querySelector(".unique-coupons-popup");
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
				{ name: "button", selector: ".unique-coupons-popup__button" },
				{ name: "coupon", selector: ".unique-coupons-popup__coupon" },
				{ name: "value", selector: ".unique-coupons-popup__value" },
				{ name: "expiresAt", selector: ".unique-coupons-popup__expires-at" },
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
			return fetch(uniqueCouponsPopup.api.retrieveCoupon, {
				method: "POST",
				body: JSON.stringify({
					group_id: this.groupId,
				}),
				headers: {
					"Content-Type": "application/json",
					"X-WP-Nonce": uniqueCouponsPopup.api.nonce,
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
			this.elements.expiresAt.textContent = this.getDateText(expires_at);
			this.elements.expiresAt.style.whiteSpace = "nowrap";
		};

		getDateText(timestamp) {
			const date = new Date();
			date.setTime(timestamp * 1000);
			return date.toLocaleDateString(undefined, {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		}

		handleResponseError = () => {
			this.setCanFetch(true);
		};

		queuePopup = () => {
			setTimeout(() => {
				$(this.elements.container).modal({ fadeDuration: 300, fadeDelay: 0 });
			}, uniqueCouponsPopup.timeoutInMs);
		};

		setCanFetch(canFetch) {
			this.canFetch = canFetch;
			this.elements.button.disabled = !canFetch;
			this.elements.button.style.cursor = canFetch ? "pointer" : "default";
		}
	}
})(jQuery);
