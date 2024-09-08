import createAssignmentList from "../../components/assignment_list";

import { type ModuleDataFragment } from "../../graphql/course";

export default function showModules(modules: ModuleDataFragment[]) {
	const container = document.createElement("div");
	container.id = "modules";

	for (const module of modules) {
		const module_assignments = [];

		for (const item of module.moduleItems) {
			if (item.content._id) {
				module_assignments.push(item.content);
			}
		}

		createAssignmentList(
			container,
			module.name,
			module_assignments
		);
	}

	document.body.appendChild(container);
}
