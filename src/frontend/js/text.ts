export function isHTML(text: string): boolean {
	return /<\/?\w+[\s\S]*>/.test(text);
}

export function titleCase(text: string): string {
	return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}

export function stringifyList(list: string[]): string {
	if (list.length === 0) {
		return "";
	}

	if (list.length === 1) {
		return list[0].toString();
	}

	if (list.length === 2) {
		return `${list[0]} and ${list[1]}`;
	}

	const first_elements = list.slice(0, -1).join(", ");

	return `${first_elements}, and ${list.slice(-1)[0]}`;
}
