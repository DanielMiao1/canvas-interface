import apiRequest from "../../api/request";
import showAssignments from "./assignments";
import showCourses from "./courses";

import dashboard_query, {
	type AssignmentDataFragment,
	type DashboardQueryData
} from "../../graphql/dashboard";

export default async function dashboardView() {
	import("../../../css/views/dashboard.scss").catch(() => {
		console.error("Failed to load css file");
	});

	const data = await apiRequest(dashboard_query) as DashboardQueryData;

	const courses = data.allCourses;

	showCourses(courses);

	const assignments: AssignmentDataFragment[] = [];

	for (const course of courses) {
		assignments.push(...course.assignmentsConnection.nodes);
	}

	showAssignments(assignments, courses);
}
