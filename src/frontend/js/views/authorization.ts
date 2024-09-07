import { hasCredentials } from "../api/api";

function missingFields() {
	const dialog = document.getElementById("dialog");

	if (!dialog || document.getElementsByClassName("alert").length > 0) {
		return;
	}

	for (const element of dialog.children) {
		if (element.nodeName === "BUTTON") {
			const alert = document.createElement("p");
			alert.classList.add("alert");
			alert.innerText = "Both values are required";
			element.before(alert);

			return;
		}
	}
}

function processCredentials() {
	const installation_input = document.getElementById("installation");
	const token_input = document.getElementById("token");

	const installation = (installation_input as HTMLInputElement).value;
	const token = (token_input as HTMLInputElement).value;

	let credentials_are_valid = true;

	if (!installation) {
		installation_input?.classList.add("missing");
		credentials_are_valid = false;
		missingFields();
	}

	if (!token) {
		token_input?.classList.add("missing");
		credentials_are_valid = false;
		missingFields();
	}

	if (credentials_are_valid) {
		localStorage.installation = installation;
		localStorage.token = token;
		document.location.reload();
	}
}

export function ensureAuthorized() {
	if (hasCredentials()) {
		return true;
	}

	const dialog = document.createElement("div");
	dialog.id = "dialog";

	const dialog_title = document.createElement("h1");
	dialog_title.innerText = "Credentials";
	dialog.appendChild(dialog_title);

	const installation_input_label = document.createElement("p");
	installation_input_label.innerText = "Canvas installation URL";
	dialog.appendChild(installation_input_label);

	const installation_input = document.createElement("input");
	installation_input.id = "installation";
	installation_input.placeholder = "Usually ends with .instructure.com";
	dialog.appendChild(installation_input);

	const token_input_label = document.createElement("p");
	token_input_label.innerText = "Access token (see the guide ";

	const token_generation_link = document.createElement("a");
	token_generation_link.href = "https://community.canvaslms.com/t5/Student-Guide/How-do-I-manage-API-access-tokens-as-a-student/ta-p/273";
	token_generation_link.target = "blank_";
	token_generation_link.innerText = "here";
	token_input_label.appendChild(token_generation_link);

	const token_input_label_suffix = document.createTextNode(")");
	token_input_label.appendChild(token_input_label_suffix);

	dialog.appendChild(token_input_label);

	const token_input = document.createElement("input");
	token_input.id = "token";
	token_input.placeholder = "Starts with numbers followed by ~";
	dialog.appendChild(token_input);

	const continue_button = document.createElement("button");
	continue_button.innerText = "Continue";
	continue_button.classList.add("continue");

	continue_button.addEventListener("click", processCredentials);

	dialog.appendChild(continue_button);

	document.body.appendChild(dialog);

	return false;
}
