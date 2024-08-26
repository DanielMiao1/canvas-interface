import { dateNumber, formatTime, timestampOf } from "./time";

import { type Assignment } from "./api";

function createTimeContainers(): HTMLElement[] {
	const container = document.getElementById("assignments");

	const earlier_container = document.createElement("div");
	earlier_container.classList.add("assignment-date-container");

	const earlier_title = document.createElement("p");
	earlier_title.innerText = "Earlier";
	earlier_title.classList.add("assignment-container-title");
	earlier_container.appendChild(earlier_title);

	container?.appendChild(earlier_container);
	
	const today_container = document.createElement("div");
	today_container.classList.add("assignment-date-container");

	const today_title = document.createElement("p");
	today_title.innerText = "Due Today";
	today_title.classList.add("assignment-container-title");
	today_container.appendChild(today_title);

	container?.appendChild(today_container);

	const upcoming_container = document.createElement("div");
	upcoming_container.classList.add("assignment-date-container");

	const upcoming_title = document.createElement("p");
	upcoming_title.innerText = "Upcoming";
	upcoming_title.classList.add("assignment-container-title");
	upcoming_container.appendChild(upcoming_title);

	container?.appendChild(upcoming_container);

	return [earlier_container, today_container, upcoming_container];
}

export default function showAssignments(assignments: Assignment[]) {
	const container = document.createElement("div");
	container.id = "assignments";
	document.body.appendChild(container);

	const [
		earlier_container, today_container, upcoming_container
	] = createTimeContainers();

	for (const assignment of assignments.sort((a, b) => timestampOf(a.due_at) - timestampOf(b.due_at))) {
		if (assignment.has_submitted_submissions) {
			continue;
		}

		console.log(assignment);
		const element = document.createElement("button");
		element.classList.add("assignment");
		element.title = `Assignment ${assignment.id}`;
		
		const description_element = document.createElement("p");
		description_element.classList.add("description");

		if (assignment.name) {
			description_element.innerText = assignment.name;
		} else {
			description_element.innerText = "<No Description>";
		}

		element.appendChild(description_element);

		const due_at_element = document.createElement("p");
		due_at_element.classList.add("due-at");

		due_at_element.innerText = formatTime(assignment.due_at);

		element.appendChild(due_at_element);

		const due_date = dateNumber(assignment.due_at);
		const current_date = dateNumber();

		if (due_date < current_date) {
			earlier_container.appendChild(element);
		} else if (due_date === current_date) {
			today_container.appendChild(element);
		} else {
			upcoming_container.appendChild(element);
		}
	}
}
