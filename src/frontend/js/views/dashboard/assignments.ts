import createAssignmentList from "../../components/assignment_list";

import { dateNumber } from "../../time";

import {
	type AssignmentDataFragment,
	type CourseDataFragment
} from "../../graphql/dashboard";

const course_names: Record<string, string> = {};

function getCourseName(id: string) {
	return course_names[id];
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

	for (const assignment of assignments) {
		const due_date = assignment.dueAt;

		if (due_date) {
			const due_date_number = dateNumber(due_date);
			const current_date_number = dateNumber();

			if (due_date_number < current_date_number) {
				earlier_assignments.push(assignment);
			} else if (due_date_number === current_date_number) {
				today_assignments.push(assignment);
			} else {
				upcoming_assignments.push(assignment);
			}
		} else {
			unknown_time_assignments.push(assignment);
		}
	}

	createAssignmentList(
		container,
		"Earlier",
		earlier_assignments,
		getCourseName
	);

	createAssignmentList(
		container,
		"Due Today",
		today_assignments,
		getCourseName
	);

	if (unknown_time_assignments.length > 0) {
		createAssignmentList(
			container,
			"Unknown Due Date",
			unknown_time_assignments,
			getCourseName
		);
	}

	createAssignmentList(
		container,
		"Upcoming",
		upcoming_assignments,
		getCourseName
	);
}
