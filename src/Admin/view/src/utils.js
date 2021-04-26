export function getDateText(timestamp) {
	const date = new Date();
	date.setTime(timestamp * 1000);
	return date.toLocaleDateString(undefined, {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}
