import showAssignments from "./assignments";
import showCourses from "./courses";

import { type Course, type Assignment } from "./api";
import apiRequest from "./api";

import "../css/index.scss";

import {
	ensureAuthorized,
} from "./authorization";

function dashboardView() {
	apiRequest(`
		query courseData {
			allCourses {
				_id
				name
				assignmentsConnection {
					nodes {
						dueAt
						name
						_id
						courseId
						submissionTypes
						allowedExtensions
						description
					}
				}
			}
		}
	`).then(async (
		data: {
			allCourses: Course[]
		}
	) => {
		void import("../css/courses.scss");

		const courses = data.allCourses;

		showCourses(courses);

		const assignments: Assignment[] = [];

		for (const course of courses) {
			assignments.push(...course.assignmentsConnection.nodes);
		}

		showAssignments(assignments, courses);
	});
}

if (ensureAuthorized()) {
	dashboardView();
}
