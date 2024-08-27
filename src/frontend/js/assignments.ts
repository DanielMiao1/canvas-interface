import { dateNumber, formatTime, timestampOf } from "./time";
import { getCourseInfo } from './api';
import { isHTML, stringifyList, titleCase } from "./text";

import {
	type Assignment,
	type assignment_submission_type,
	type Course
} from "./api";

let assignment_data: Record<string, Assignment> = {};

let course_names: Record<number, string> = {};

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
		if (formats.length >= 10) {
			result += "file upload (see tooltip for accepted formats), ";
		} else {
			result += `file upload (${stringifyList(formats)} accepted), `;
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

function createTimeContainers(): HTMLElement[] {
	const container = document.getElementById("assignments");

	const earlier_container = document.createElement("div");
	earlier_container.classList.add("assignment-date-container");

	const earlier_title = document.createElement("p");
	earlier_title.innerText = "Earlier";
	earlier_title.classList.add("assignment-container-title");
	earlier_container.appendChild(earlier_title);

	container?.appendChild(earlier_container);
	
	const today_container = document.createElement("div");
	today_container.classList.add("assignment-date-container");

	const today_title = document.createElement("p");
	today_title.innerText = "Due Today";
	today_title.classList.add("assignment-container-title");
	today_container.appendChild(today_title);

	container?.appendChild(today_container);

	const upcoming_container = document.createElement("div");
	upcoming_container.classList.add("assignment-date-container");

	const upcoming_title = document.createElement("p");
	upcoming_title.innerText = "Upcoming";
	upcoming_title.classList.add("assignment-container-title");
	upcoming_container.appendChild(upcoming_title);

	container?.appendChild(upcoming_container);

	return [earlier_container, today_container, upcoming_container];
}

function collapseExpandedAssignment() {
	const expanded_element = document.getElementById("assignment-info");
	if (expanded_element) {
		expanded_element.remove();
	}
}

function renderDescriptionHTML(html: string) {
	const description = document.getElementById("assignment-description")!;
	description.innerHTML = html;
}

async function expandAssignmentInfo(assignment_element: HTMLButtonElement) {
	collapseExpandedAssignment();

	const data = assignment_data[assignment_element.getAttribute("data-id")!];

	const info_element = document.createElement("div");
	info_element.id = "assignment-info";

	const info_header = document.createElement("div");
	info_header.classList.add("assignment-info-header");

	const course_id = data.course_id;

	let course_name: string;

	if (course_id in course_names) {
		course_name = course_names[course_id];
	} else {
		const course_info = await getCourseInfo(course_id);
		course_name = course_info.name;
	}

	const course_name_element = document.createElement("p");
	course_name_element.innerText = `Course: ${course_name}`;
	info_header.appendChild(course_name_element);

	const submission_types = data.submission_types;
	const submission_formats = data.allowed_extensions;

	const submission_types_element = document.createElement("p");
	submission_types_element.innerText = formatSubmissionType(
		submission_types, submission_formats
	);

	let submission_types_tooltip = `Submission methods: ${stringifyList(submission_types)}`;

	if (typeof submission_formats === "object") {
		submission_types_tooltip += `\nAccepted formats (for file uploads): ${stringifyList(submission_formats)}`
	}

	submission_types_element.title = submission_types_tooltip;
	info_header.appendChild(submission_types_element);

	info_element.appendChild(info_header);

	if (data.description) {
		const description_element = document.createElement("p");
		description_element.id = "assignment-description"
		description_element.innerText = data.description;
		info_element.appendChild(description_element);

		if (isHTML(data.description)) {
			const show_html = document.createElement("button");
			show_html.classList.add("outline", "danger");
			show_html.innerText = "Render HTML";

			show_html.addEventListener("click", () => {
				renderDescriptionHTML(data.description!);
				show_html.remove();
			});

			info_element.appendChild(show_html);
		}
	}

	assignment_element.appendChild(info_element);
}

export default function showAssignments(
	assignments: Assignment[],
	courses: Course[]
) {
	for (const course of courses) {
		course_names[course.id] = course.name;
	}

	const container = document.createElement("div");
	container.id = "assignments";
	document.body.appendChild(container);

	const [
		earlier_container, today_container, upcoming_container
	] = createTimeContainers();

	for (const assignment of assignments.sort((a, b) => timestampOf(a.due_at) - timestampOf(b.due_at))) {
		if (assignment.has_submitted_submissions) {
			continue;
		}

		assignment_data[assignment.id.toString()] = assignment;

		const element = document.createElement("button");
		element.classList.add("assignment");
		element.setAttribute("data-id", assignment.id.toString());
		element.title = `Assignment ${assignment.id}`;

		const assignment_title = document.createElement("div");
		assignment_title.classList.add("assignment-title");
		assignment_title.addEventListener("click", async () => {
			if (element.children.length > 1) {
				collapseExpandedAssignment();
			} else {
				await expandAssignmentInfo(element);
			}
		});
		
		const description_element = document.createElement("p");
		description_element.classList.add("description");

		if (assignment.name) {
			description_element.innerText = assignment.name;
		} else {
			description_element.innerText = "<No Description>";
		}

		assignment_title.appendChild(description_element);

		const due_at_element = document.createElement("p");
		due_at_element.classList.add("due-at");

		due_at_element.innerText = formatTime(assignment.due_at);

		assignment_title.appendChild(due_at_element);

		element.appendChild(assignment_title);

		const due_date = dateNumber(assignment.due_at);
		const current_date = dateNumber();

		if (due_date < current_date) {
			earlier_container.appendChild(element);
		} else if (due_date === current_date) {
			today_container.appendChild(element);
		} else {
			upcoming_container.appendChild(element);
		}
	}
}
