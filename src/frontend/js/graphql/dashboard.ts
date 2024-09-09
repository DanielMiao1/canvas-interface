import { type assignment_submission_type } from "../api/types";
import { type MinimalAssignmentData } from "../components/assignment_list";

const dashboard_query = `
	query listCourses {
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

export interface AssignmentDataFragment extends MinimalAssignmentData {
	allowedExtensions: string[];
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

export default dashboard_query;
