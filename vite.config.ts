import { defineConfig } from "vite";

export default defineConfig({
	build: {
		emptyOutDir: true,
		outDir: "../../dist/frontend",
		sourcemap: process.env["NODE_ENV"] !== "production"
	},
	root: "./src/frontend"
});
