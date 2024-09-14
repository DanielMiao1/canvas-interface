import courseView from "./views/course/course";
import createBackButton from "./components/back_button";
import dashboardView from "./views/dashboard/dashboard";

import { urlMatches } from "./routing";

import "../css/index.scss";

import {
	ensureAuthorized
} from "./views/authorization";

function fileNotFoundView() {
	import("../css/views/404.scss").catch(() => {
		console.error("Failed to load css file");
	});

	createBackButton();

	const container = document.createElement("div");
	container.classList.add("container");

	const title = document.createElement("h1");
	title.innerText = "404";
	container.appendChild(title);

	const description = document.createElement("p");
	description.innerText = "The requested path was not found.";
	container.appendChild(description);

	document.body.appendChild(container);
}

async function route() {
	if (urlMatches(/^\/$/)) {
		await dashboardView();
	} else if (urlMatches(/^\/course\/\d+$/)) {
		await courseView();
	} else {
		fileNotFoundView();
	}
}

if (ensureAuthorized()) {
	route().catch((error: unknown) => {
		console.error(error);
		throw new Error("Failed to load view for current page.");
	});
}
