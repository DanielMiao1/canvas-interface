import { join } from "path";
import { readFileSync } from "fs";

import registerApiHooks from "./api.js";

import { fastify } from "fastify";
import { fastifyStatic } from "@fastify/static";

const server = fastify({
	logger: process.env.NODE_ENV !== "production"
});

server.register(fastifyStatic, {
	prefix: "/assets",
	root: join(process.cwd(), "dist/frontend/assets")
});

server.get("*", (_, reply) => {
	reply.type("text/html");
	return readFileSync(join(process.cwd(), "dist/frontend/index.html"));
});

registerApiHooks(server);

const start = async () => {
	try {
		await server.listen({
			host: "0.0.0.0",
			port: 8192
		});
	} catch (error) {
		server.log.error(error);
		throw new Error("Server failed to start");
	}
};

await start();
