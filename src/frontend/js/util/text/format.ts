export function isHTML(text: string): boolean {
	return /<\/?\w+[\s\S]*>/.test(text);
}

export function titleCase(text: string): string {
	return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
}
