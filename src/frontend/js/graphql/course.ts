import type { assignment_submission_type } from "../api/types";
import type { MinimalAssignmentData } from "../components/assignment_list";

const course_query = `
	query courseData {
		course(id: [courseId]) {
			name
			modulesConnection {
				nodes {
					name
					moduleItems {
						content {
							... on Assignment {
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
			}
		}
	}
`;

export interface ModuleContentDataFragment extends MinimalAssignmentData {
	allowedExtensions: string[];
	submissionTypes: assignment_submission_type[];
}

export interface ModuleItemsDataFragment {
	content: ModuleContentDataFragment;
}

export interface ModuleDataFragment {
	name: string;
	moduleItems: ModuleItemsDataFragment[];
}

export interface CourseDataFragment {
	name: string;
	modulesConnection: {
		nodes: ModuleDataFragment[];
	};
}

export interface CourseQueryData {
	course: CourseDataFragment;
}

export default course_query;
