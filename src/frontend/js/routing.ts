import { fragmentate } from "./text";

export function fragmentateUrl(query_string: string) {
	const url = document.location.pathname;
	return fragmentate(url, query_string);
}

export function urlMatches(regexp: RegExp) {
	const url = document.location.pathname;
	return regexp.test(url);
}
