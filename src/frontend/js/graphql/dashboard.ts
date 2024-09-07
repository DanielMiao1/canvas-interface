import { type assignment_submission_type } from "../api/types";

const dashboardQuery = `
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
`;

export interface AssignmentDataFragment {
	_id: string;
	allowedExtensions: string[];
	courseId: string;
	description: string | null;
	dueAt?: string;
	name?: string;
	submissionTypes: assignment_submission_type[];
}

export interface CourseDataFragment {
	_id: string;
	name: string;
	assignmentsConnection: {
		nodes: AssignmentDataFragment[];
	};
}

export interface DashboardQueryData {
	allCourses: CourseDataFragment[];
}

export default dashboardQuery;
