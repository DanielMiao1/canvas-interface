export function isHTML(text: string): boolean {
	return /<\/?\w+[\s\S]*>/.test(text);
}
