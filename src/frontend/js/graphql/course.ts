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

export interface ModuleItemDataFragment {
	name?: string;
	_id?: string;
	dueAt?: string;
}

export interface ModuleDataFragment {
	name: string;
	moduleItems: {
		content: ModuleItemDataFragment[];
	};
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
