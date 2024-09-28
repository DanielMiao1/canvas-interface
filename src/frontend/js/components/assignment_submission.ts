import { createDialog } from "./dialog";
import { formatSubmissionType } from "../api/format";
import { formatTime } from "../util/time";

import type { assignment_submission_type } from "../api/types";
import type { MinimalAssignmentData } from "./assignment_list";

function textEntry(dialog: HTMLDivElement) {
	const textarea = document.createElement("textarea");

	dialog.appendChild(textarea);
}

function createSubmissionTypesDropdown(types: assignment_submission_type[]) {
	const dropdown = document.createElement("select");

	for (const type of types) {
		const option = document.createElement("option");
		option.innerText = formatSubmissionType(type);

		dropdown.appendChild(option);
	}

	return dropdown;
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

		const type_dropdown = createSubmissionTypesDropdown(types);
		dialog.appendChild(type_dropdown);

		if (types.includes("online_text_entry")) {
			textEntry(dialog);
		}
	} else {
		const message = document.createElement("p");
		message.innerText = "No submission methods defined";
		dialog.appendChild(message);
	}
}
