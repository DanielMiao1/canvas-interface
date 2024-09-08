import { stringifyList } from "./list";
import { titleCase } from "./format";

import { type assignment_submission_type } from "../../api/types";

export function formatSubmissionType(
	types: assignment_submission_type[],
	formats?: string[]
): string {
	if (
		types.length === 0 ||
		(types.length === 1 && (types[0] === "none"))
	) {
		return "Submission methods not specified";
	}

	if (types.length === 1 && types[0] === "not_graded") {
		return "Submission methods not specified (not graded)";
	}

	let result = "";

	if (types.includes("online_quiz")) {
		result += "online quiz, ";
	}

	if (types.includes("discussion_topic")) {
		result += "discussion, ";
	}

	if (types.includes("online_url")) {
		result += "online URL, ";
	}

	if (types.includes("media_recording")) {
		result += "media recording, ";
	}

	if (types.includes("on_paper")) {
		result += "submit on paper, ";
	}

	if (types.includes("external_tool")) {
		result += "external tool, ";
	}

	if (types.includes("online_text_entry")) {
		result += "online text entry, ";
	}

	if (types.includes("student_annotation")) {
		result += "annotation, ";
	}

	if (types.includes("online_upload")) {
		if (!formats || formats.length === 0) {
			result += "file upload, ";
		} else if (formats.length >= 10) {
			result += "file upload (see tooltip for accepted formats), ";
		} else {
			result += `file upload (accepts ${stringifyList(formats)}), `;
		}
	}

	if (result.endsWith(", ")) {
		result = result.slice(0, -2);
	}

	if (result.length === 0) {
		return "Unknown submission methods (see tooltip)";
	}

	return titleCase(result);
}

export function formatSubmissionDataTooltip(
	types: assignment_submission_type[],
	formats?: string[]
) {
	let tooltip = `Submission methods: ${stringifyList(types)}`;

	if (Array.isArray(formats)) {
		if (formats.length > 0) {
			tooltip += `\nAccepted file formats: ${stringifyList(formats)}`;
		} else {
			tooltip += "\nNo file formats provided";
		}
	}

	return tooltip;
}
