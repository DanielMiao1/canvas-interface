import { stringifyList } from "../util/text/list";
import { titleCase } from "../util/text/format";

import type { assignment_submission_type } from "./types";

const assignment_submission_type_names = {
	attendance: "Attendance",
	basic_lti_launch: "External LTI Tool",
	discussion_topic: "Discussion",
	external_tool: "External Tool",
	media_recording: "Media Recording",
	none: "None",
	not_graded: "Not Graded",
	on_paper: "On Paper",
	online_quiz: "Online Quiz",
	online_text_entry: "Text Entry",
	online_upload: "File Upload",
	online_url: "Website URL",
	student_annotation: "Document Annotation",
	wiki_page: "Wiki Page"
};

export function formatSubmissionType(
	type: assignment_submission_type
) {
	return assignment_submission_type_names[type];
}

export function formatSubmissionTypes(
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

	for (const type of types) {
		if (type === "online_upload") {
			if (!formats || formats.length === 0) {
				result += "file upload, ";
			} else if (formats.length >= 10) {
				result += "file upload (see tooltip for accepted formats), ";
			} else {
				result += `file upload (accepts ${stringifyList(formats)}), `;
			}
		} else {
			result += `${formatSubmissionType(type).toLowerCase()}, `;
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
