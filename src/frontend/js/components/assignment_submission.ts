import { createDialog } from "./dialog";
import { formatTime } from "../time";

import type { MinimalAssignmentData } from "./assignment_list";

function textEntry(dialog: HTMLDivElement) {
	const textarea = document.createElement("textarea");

	dialog.appendChild(textarea);
}

export default function openSubmissionDialog(
	assignment_data: MinimalAssignmentData
) {
	const dialog = createDialog(["max-size"], false);

	const title = document.createElement("b");
	title.innerText = assignment_data.name ?? "Unnamed Assignment";
	dialog.appendChild(title);

	const due_date = document.createElement("i");

	if (assignment_data.dueAt) {
		due_date.innerText = `Due ${formatTime(assignment_data.dueAt)}`;
	} else {
		due_date.innerText = "No due date provided";
	}
	dialog.appendChild(due_date);

	if (assignment_data.description) {
		const description = document.createElement("p");
		description.innerHTML = assignment_data.description;
		dialog.appendChild(description);
	}

	if (assignment_data.submissionTypes) {
		const types = assignment_data.submissionTypes;

		if (types.includes("online_text_entry")) {
			textEntry(dialog);
		}
	} else {
		const message = document.createElement("p");
		message.innerText = "No submission methods defined";
		dialog.appendChild(message);
	}
}
