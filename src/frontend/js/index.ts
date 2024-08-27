import showAssignments from "./assignments";
import showCourses from "./courses";

import { type Course, type Assignment } from "./api";
import { assignmentsInCourse, listCourses } from "./api";

import "../css/index.scss";

import {
	ensureAuthorized,
} from "./authorization";

function dashboardView() {
	listCourses().then(async (courses: Course[]) => {
		void import("../css/courses.scss");

		showCourses(courses);

		const assignments: Assignment[] = [];

		for (const course of courses) {
			assignments.push(...await assignmentsInCourse(course.id));
		}

		showAssignments(assignments, courses);
	});
}

if (ensureAuthorized()) {
	dashboardView();
}
