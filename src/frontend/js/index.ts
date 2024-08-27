import apiRequest from "./api";
import getUserID from "./user";
import showAssignments from "./assignments";
import showCourses from "./courses";

import { type Course, type Assignment } from "./api";

import "../css/index.scss";

import {
	ensureAuthorized,
} from "./authorization";

function dashboardView() {
	apiRequest("/api/courses").then(response => response.json()).then(async (courses: Course[]) => {
		void import("../css/courses.scss");

		showCourses(courses);

		const assignments: Assignment[] = [];

		for (const course of courses) {
			const user_id = await getUserID();
			const course_id = course.id;

			const request = await apiRequest(
				`/api/users/${user_id}/courses/${course_id}/assignments`
			);

			const data: Assignment[] = await request.json();

			assignments.push(...data);
		}

		showAssignments(assignments);
	});
}

if (ensureAuthorized()) {
	dashboardView();
}
