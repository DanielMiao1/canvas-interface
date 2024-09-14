import { Client, cacheExchange, fetchExchange } from "@urql/core";

import { type FastifyInstance } from "fastify";

function ensureTrailingSlash(path: string) {
	if (path.endsWith("/")) {
		return path;
	}

	return `${path}/`;
}

function noLeadingSlash(path: string) {
	if (path.startsWith("/")) {
		return path.slice(1);
	}

	return path;
}

async function graphqlRequest(
	installation: string,
	token: string,
	query: string
) {
	const client = new Client({
		url: `${ensureTrailingSlash(installation)}api/graphql`,
		exchanges: [cacheExchange, fetchExchange],
		fetchOptions: () => {
			return {
				headers: {
					authorization: token
				}
			};
		}
	});

	const request = await client.query(query, {});
	const data = request.data as unknown;

	return data;
}

async function restRequest(
	installation: string,
	token: string,
	path: string,
	method: string,
	form_data?: Record<string, string>
) {
	const url = ensureTrailingSlash(installation) + noLeadingSlash(path);

	let request;

	if (["DELETE", "POST", "PUT"].includes(method)) {
		request = await fetch(url, {
			body: new URLSearchParams(form_data),
			headers: {
				authorization: token
			},
			method
		});
	} else {
		request = await fetch(url, {
			headers: {
				authorization: token
			},
			method
		});
	}

	const data = await request.json() as unknown;

	return data;
}

export default function registerApiHooks(server: FastifyInstance) {
	server.post("/graphql", async (request, reply) => {
		const installation = request.headers.installation;
		const token = request.headers.authorization;

		if (!installation || !token) {
			reply.status(401).send();
			return;
		}

		const data = await graphqlRequest(
			installation as string,
			token,
			request.body as string
		);

		reply.send(data);
	});

	server.post("/api/v1/*", async (request, reply) => {
		const installation = request.headers.installation;
		const token = request.headers.authorization;

		if (!installation || !token) {
			reply.status(401).send();
			return;
		}

		const data = await restRequest(
			installation as string,
			token,
			request.url,
			"POST",
			request.body as Record<string, string>
		);

		reply.send(data);
	});

	server.get("/api/v1/*", async (request, reply) => {
		const installation = request.headers.installation;
		const token = request.headers.authorization;

		if (!installation || !token) {
			reply.status(401).send();
			return;
		}

		const data = await restRequest(
			installation as string,
			token,
			request.url,
			"GET"
		);

		reply.send(data);
	});

	server.delete("/api/v1/*", async (request, reply) => {
		const installation = request.headers.installation;
		const token = request.headers.authorization;

		if (!installation || !token) {
			reply.status(401).send();
			return;
		}

		const data = await restRequest(
			installation as string,
			token,
			request.url,
			"DELETE",
			request.body as Record<string, string>
		);

		reply.send(data);
	});

	server.put("/api/v1/*", async (request, reply) => {
		const installation = request.headers.installation;
		const token = request.headers.authorization;

		if (!installation || !token) {
			reply.status(401).send();
			return;
		}

		const data = await restRequest(
			installation as string,
			token,
			request.url,
			"PUT",
			request.body as Record<string, string>
		);

		reply.send(data);
	});
}
