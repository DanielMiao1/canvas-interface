import { Client, cacheExchange, fetchExchange } from "@urql/core";

import { type FastifyInstance } from "fastify";

function ensureTrailingSlash(path: string) {
	if (path.endsWith("/")) {
		return path;
	}

	return `${path}/`;
}

async function apiRequest(
	installation: string,
	token: string,
	query: string,
) {
	const client = new Client({
		url: `${ensureTrailingSlash(installation)}api/graphql`,
		exchanges: [cacheExchange, fetchExchange],
		fetchOptions: () => {
			return {
				headers: {
					authorization: token
				},
			};
		},
	});

	const request = await client.query(query, {});
	const data = request.data;

	return data;
}

export default function registerApiHooks(server: FastifyInstance) {
	server.post("/graphql", async (request, reply) => {
		if (!request.headers["installation"] || !request.headers["authorization"]) {
			reply.status(400).send();
		}

		const data = await apiRequest(
			request.headers["installation"] as string,
			request.headers["authorization"],
			request.body as string
		);

		reply.send(data);
	});
}
