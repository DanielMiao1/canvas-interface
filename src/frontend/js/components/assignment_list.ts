import createList from "./list";
import openSubmissionDialog from "./assignment_submission";

import { formatTime, timestampOf } from "../util/time";

import {
	formatSubmissionDataTooltip,
	formatSubmissionTypes
} from "../api/format";

import type { assignment_submission_type } from "../api/types";
import type { ListItemData } from "./list";

type course_name_function = (id: string) => string;

export interface MinimalAssignmentData {
	_id: string;
	allowedExtensions?: string[];
	courseId?: string;
	description?: string | null;
	dueAt?: string;
	name?: string;
	submissionTypes?: assignment_submission_type[];
}

const assignment_data: Record<string, MinimalAssignmentData> = {};

function expandAssignment(
	this: course_name_function | false,
	expansion_container: HTMLDivElement
) {
	const list_item = expansion_container.parentNode as HTMLElement;
	const assignment_id = list_item.dataset.id;

	if (!assignment_id) {
		return;
	}

	const data = assignment_data[assignment_id];

	const info_row = document.createElement("div");
	info_row.classList.add("assignment-info");

	if (typeof this === "function" && data.courseId) {
		const course_name = this(data.courseId);

		const course_name_element = document.createElement("p");
		course_name_element.innerText = `Course: ${course_name}`;
		info_row.appendChild(course_name_element);
	}

	if (data.submissionTypes) {
		const submission_types_element = document.createElement("p");
		submission_types_element.innerText = formatSubmissionTypes(
			data.submissionTypes, data.allowedExtensions
		);

		submission_types_element.title = formatSubmissionDataTooltip(
			data.submissionTypes, data.allowedExtensions
		);

		info_row.appendChild(submission_types_element);
	}

	expansion_container.appendChild(info_row);

	if (data.description) {
		const description = data.description;

		const description_element = document.createElement("p");
		description_element.innerHTML = description;
		description_element.classList.add("assignment-description");
		expansion_container.appendChild(description_element);
	}

	const submit_button = document.createElement("button");
	submit_button.classList.add("outline", "continue");
	submit_button.innerText = "Begin Submission";

	submit_button.addEventListener("click", () => {
		openSubmissionDialog(data);
	});

	expansion_container.appendChild(submit_button);
}

function sortAssignmentDueDate(
	a: MinimalAssignmentData,
	b: MinimalAssignmentData
) {
	if (!a.dueAt) {
		return 1;
	}

	if (!b.dueAt) {
		return -1;
	}

	return timestampOf(a.dueAt) - timestampOf(b.dueAt);
}

export default function createAssignmentList(
	container: HTMLElement,
	title: string,
	assignments: MinimalAssignmentData[],
	courses?: course_name_function
) {
	const list_items = [];

	for (const assignment of assignments.sort(sortAssignmentDueDate)) {
		assignment_data[assignment._id] = assignment;

		const list_item_data: ListItemData = {
			data: {
				id: assignment._id
			},
			expandable: true,
			expander_function: expandAssignment.bind(courses ?? false),
			primary_title: assignment.name ?? "Unnamed Assignment",
			tooltip: `Assignment ${assignment._id}`
		};

		const due_date = assignment.dueAt;

		if (due_date) {
			list_item_data.secondary_title = formatTime(due_date);
		}

		list_items.push(list_item_data);
	}

	const list = createList(container, {
		items: list_items,
		title
	});

	list.classList.add("assignment-list");

	return list;
}
