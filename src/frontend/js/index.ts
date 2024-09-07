import createBackButton from "./components/back_button";
import dashboardView from "./views/dashboard/dashboard";
import urlMatches from "./routing";

import "../css/index.scss";

import {
	ensureAuthorized
} from "./views/authorization";

function fileNotFoundView() {
	import("../css/404.scss").catch(() => {
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

if (ensureAuthorized()) {
	if (urlMatches(/^\/$/)) {
		dashboardView().catch(() => {
			console.error("Dashboard failed to load");
		});
	} else {
		fileNotFoundView();
	}
}
