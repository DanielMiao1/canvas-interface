export function createDialog(classList?: string[], close_on_click = true) {
	const backdrop = document.createElement("div");
	backdrop.classList.add("dialog-backdrop");

	const dialog = document.createElement("div");
	dialog.classList.add("dialog");
	
	if (classList) {
		dialog.classList.add(...classList);
	}

	if (close_on_click) {
		backdrop.addEventListener("click", (event: MouseEvent) => {
			const target = event.target as HTMLElement;

			if (target.classList.contains("dialog-backdrop")) {
				closeDialog();
			}
		});
	} else {
		const close_button = document.createElement("button");
		close_button.classList.add("close-button");
		close_button.innerText = "\u00D7";

		close_button.addEventListener("click", () => {
			closeDialog();
		})

		dialog.appendChild(close_button);
	}

	backdrop.appendChild(dialog);

	document.body.appendChild(backdrop);

	return dialog;
}

export function closeDialog() {
	for (const dialog of document.getElementsByClassName("dialog-backdrop")) {
		dialog.remove();
	}
}
