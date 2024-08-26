import { join } from "path";
import { readFileSync } from "fs";

import { fastify } from "fastify";
import { fastifyStatic } from "@fastify/static";

const server = fastify();

server.register(fastifyStatic, {
	prefix: "/assets",
	root: join(process.cwd(), "dist/frontend/assets")
});

server.get("/", (_, reply) => {
	reply.type("text/html");
	return readFileSync(join(process.cwd(), "dist/frontend/index.html"));
});

function ensureTrailingSlash(url: string) {
	if (url.endsWith("/")) {
		return url;
	}

	return `${url}/`;
}

async function apiRequest(
	url: string,
	installation: string,
	authorization: string
) {
	const request = await fetch(ensureTrailingSlash(installation) + url, {
		headers: {
			"Authorization": authorization
		}
	});

	const data = await request.json();

	return data;
}

server.get("/api/*", async (request, reply) => {
	if (!request.headers["installation"] || !request.headers["authorization"]) {
		reply.status(400).send();
		return;
	}

	const data = await apiRequest(
		`api/v1${request.url.slice(4)}`,
		request.headers["installation"] as string,
		request.headers["authorization"]
	);

	reply.send(data);
})

const start = async () => {
	try {
		await server.listen({
			host: "0.0.0.0",
			port: 8192
		});
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
};

await start();
