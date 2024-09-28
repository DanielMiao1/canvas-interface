import { deFragmentate } from "../util/text/fragmentation";

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

function graphqlRequest(
	query: string,
	variables: Record<string, string>,
	installation: string,
	token: string
) {
	return fetch("/graphql", {
		body: deFragmentate(query, variables),
		headers: {
			authorization: `Bearer ${token}`,
			installation
		},
		method: "POST"
	});
}

function restRequest(
	path: string,
	data: Record<string, string>,
	installation: string,
	token: string,
	method: string
) {
	let request;
	if (["DELETE", "POST", "PUT"].includes(method)) {
		request = fetch(path, {
			body: new URLSearchParams(data),
			headers: {
				authorization: `Bearer ${token}`,
				installation
			},
			method
		});
	} else {
		request = fetch(path, {
			headers: {
				authorization: `Bearer ${token}`,
				installation
			},
			method
		});
	}

	return request;
}

export default async function apiRequest(
	query: string,
	variables: Record<string, string> = {},
	method = "graphql"
) {
	const installation = getInstallationURL();
	const token = getToken();

	if (!installation || !token) {
		return {};
	}

	let request;

	if (method === "graphql") {
		request = await graphqlRequest(query, variables, installation, token);
	} else {
		request = await restRequest(query, variables, installation, token, method);
	}

	const data = await request.json() as unknown;

	return data;
}
