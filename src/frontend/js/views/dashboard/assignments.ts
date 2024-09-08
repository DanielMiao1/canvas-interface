import { dateNumber, formatTime, timestampOf } from "../../time";
import { isHTML, stringifyList, titleCase } from "../../text";

import createList from "../../components/list";

import { type ListItemData } from "../../components/list";

import {
	type AssignmentDataFragment,
	type CourseDataFragment
} from "../../graphql/dashboard";

import { type assignment_submission_type } from "../../api/types";

const assignment_data: Record<string, AssignmentDataFragment> = {};

const course_names: Record<string, string> = {};

function formatSubmissionType(
	types: assignment_submission_type[],
	formats: string[]
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
		if (formats.length === 0) {
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

function formatSubmissionDataTooltip(
	types: assignment_submission_type[], formats: string[]
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

function sortAssignmentDueDate(
	a: AssignmentDataFragment,
	b: AssignmentDataFragment
) {
	if (!a.dueAt) {
		return 1;
	}

	if (!b.dueAt) {
		return -1;
	}

	return timestampOf(a.dueAt) - timestampOf(b.dueAt);
}

function getCourseName(id: string) {
	return course_names[id];
}

function expandAssignment(expansion_container: HTMLDivElement) {
	const list_item = expansion_container.parentNode as HTMLElement;
	const assignment_id = list_item.dataset.id;

	if (!assignment_id) {
		return;
	}

	const data = assignment_data[assignment_id];

	const info_row = document.createElement("div");
	info_row.classList.add("assignment-info");
	
	const course_name = getCourseName(data.courseId);

	const course_name_element = document.createElement("p");
	course_name_element.innerText = `Course: ${course_name}`;
	info_row.appendChild(course_name_element);

	const submission_types_element = document.createElement("p");
	submission_types_element.innerText = formatSubmissionType(
		data.submissionTypes, data.allowedExtensions
	);

	submission_types_element.title = formatSubmissionDataTooltip(
		data.submissionTypes, data.allowedExtensions
	);

	info_row.appendChild(submission_types_element);
	expansion_container.appendChild(info_row);

	if (data.description) {
		const description = data.description;

		const description_element = document.createElement("p");
		description_element.innerText = description;
		description_element.classList.add("assignment-description");
		expansion_container.appendChild(description_element);

		if (isHTML(description)) {
			const html_button = document.createElement("button");
			html_button.classList.add("outline", "danger");
			html_button.innerText = "Render HTML";

			html_button.addEventListener("click", () => {
				description_element.innerHTML = description;
				html_button.remove();
			});

			expansion_container.appendChild(html_button);
		}
	}
}

export default function showAssignments(
	assignments: AssignmentDataFragment[],
	courses: CourseDataFragment[]
) {
	for (const course of courses) {
		course_names[course._id] = course.name;
	}

	const container = document.createElement("div");
	container.id = "assignments";
	document.body.appendChild(container);

	const earlier_assignments = [];
	const today_assignments = [];
	const unknown_time_assignments = [];
	const upcoming_assignments = [];

	for (const assignment of assignments.sort(sortAssignmentDueDate)) {
		assignment_data[assignment._id] = assignment;

		const list_item_data: ListItemData = {
			data: {
				id: assignment._id
			},
			expandable: true,
			expander_function: expandAssignment,
			primary_title: assignment.name ?? "Unnamed Assignment",
			tooltip: `Assignment ${assignment._id}`
		}

		const due_date = assignment.dueAt;

		if (due_date) {
			list_item_data.secondary_title = formatTime(due_date);

			const due_date_number = dateNumber(due_date);
			const current_date_number = dateNumber();

			if (due_date_number < current_date_number) {
				earlier_assignments.push(list_item_data);
			} else if (due_date_number === current_date_number) {
				today_assignments.push(list_item_data);
			} else {
				upcoming_assignments.push(list_item_data);
			}
		} else {
			unknown_time_assignments.push(list_item_data);
		}
	}

	// TODO: implement unknown time container;

	createList(container, {
		title: "Earlier",
		items: earlier_assignments
	});

	createList(container, {
		title: "Today",
		items: today_assignments
	});

	createList(container, {
		title: "Upcoming",
		items: upcoming_assignments
	});
}
