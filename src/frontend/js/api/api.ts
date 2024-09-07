export function hasCredentials() {
	return "token" in localStorage && "installation" in localStorage;
}

export function getInstallationURL() {
	if (!localStorage.installation) {
		return false;
	}

	return localStorage.installation as string;
}

export function getToken() {
	if (!localStorage.token) {
		return false;
	}

	return localStorage.token as string;
}

export default async function apiRequest(query: string) {
	const installation = getInstallationURL();
	const token = getToken();

	if (!installation || !token) {
		return {};
	}

	const request = await fetch("/graphql", {
		body: query,
		headers: {
			authorization: `Bearer ${token}`,
			installation
		},
		method: "POST"
	});

	const data = await request.json() as unknown;

	return data;
}
