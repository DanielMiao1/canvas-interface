export default function createBackButton(href = "/") {
	const back_button = document.createElement("button");
	back_button.classList.add("back-button");
	back_button.innerText = "← Back";

	back_button.addEventListener("click", () => {
		document.location = href;
	});

	document.body.appendChild(back_button);
}
