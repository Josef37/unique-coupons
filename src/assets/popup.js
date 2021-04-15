/**
@todo
Responsible for
- Displaying the popup
- Retrieving the coupon from the backend
- Displaying the coupon after retrieval
*/

window.addEventListener("DOMContentLoaded", (event) => {
	setTimeout(() => {
		document
			.querySelectorAll(".wp-coupons-popup")
			.forEach((popupContainer) => {
				popupContainer.style.display = "block";
			});
	}, 2000);
});
