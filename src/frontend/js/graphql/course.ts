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
								name
								_id
								dueAt
							}
						}
					}
				}
			}
		}
	}
`;

export interface ModuleContentDataFragment {
	name?: string;
	_id?: string;
	dueAt?: string;
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
