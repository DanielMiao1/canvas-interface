import apiRequest from "../../api/api";
import showAssignments from "./assignments";
import showCourses from "./courses";

import dashboardQuery, {
	type AssignmentDataFragment,
	type DashboardQueryData
} from "../../graphql/dashboard";

export default async function dashboardView() {
	import("../../../css/courses.scss").catch(() => {
		console.error("Failed to load css file");
	});

	const data = await apiRequest(dashboardQuery) as DashboardQueryData;

	const courses = data.allCourses;

	showCourses(courses);

	const assignments: AssignmentDataFragment[] = [];

	for (const course of courses) {
		assignments.push(...course.assignmentsConnection.nodes);
	}

	showAssignments(assignments, courses);
}
