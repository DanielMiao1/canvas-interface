export default function urlMatches(regexp: RegExp) {
	const url = document.location.pathname;
	return regexp.test(url);
}
