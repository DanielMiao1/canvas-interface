export function hasCredentials() {
	return "token" in localStorage && "installation" in localStorage;
}

export function getInstallationURL() {
	if (!localStorage["installation"]) {
		return false;
	}

	return localStorage["installation"];
}

export function getToken() {
	if (!localStorage["token"]) {
		return false;
	}

	return localStorage["token"];
}

export default async function apiRequest(query: string) {
	const installation = getInstallationURL();
	const token = getToken();

	const request = await fetch("/graphql", {
		body: query,
		headers: {
			authorization: `Bearer ${token}`,
			installation
		},
		method: "POST"
	});

	const data = await request.json();

	return data;
}
