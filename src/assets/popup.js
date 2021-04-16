/**
@todo
Responsible for
- Displaying the popup
- Retrieving the coupon from the backend
- Displaying the coupon after retrieval

Maybe add all selectors and stuff into localization
*/

window.addEventListener("DOMContentLoaded", (event) => {
	const popup = document.querySelector(".wp-coupons-popup");
	initPopup(popup);
});

function initPopup(popup) {
	const { groupId } = popup.dataset;
	if (!groupId) return;

	addButtonListeners(popup, groupId);
	queuePopupDisplaying(popup);
}

function addButtonListeners(popup, groupId) {
	popup.querySelectorAll(".wp-coupons-popup__button").forEach((button) => {
		button.addEventListener("click", () => handleRetrieval(groupId));
	});
}

function handleRetrieval(groupId) {
	fetch(wpCouponsPopup.api.retrieveCoupon, {
		method: "POST",
		body: JSON.stringify({
			group_id: groupId,
		}),
		headers: {
			"Content-Type": "application/json",
			"X-WP-Nonce": wpCouponsPopup.api.nonce,
		},
	})
		.then((response) => response.json())
		.then((json) => {
			document.querySelector(".wp-coupons-popup__coupon").innerHTML =
				'<pre style="font-size: 2rem;">' +
				JSON.stringify(json, null, 2) +
				"</pre>";
		});
}

function queuePopupDisplaying(popup) {
	setTimeout(() => {
		popup.style.display = "block";
	}, wpCouponsPopup.timeoutInMs);
}
