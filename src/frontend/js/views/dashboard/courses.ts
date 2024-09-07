import scrollListener from "../../scroll";

import { type Course } from "../../api/types";

function createCourseElement(course: Course) {
	const container = document.getElementById("courses");

	const card = document.createElement("button");
	card.classList.add("course");
	card.title = `Course ${course._id}`;
	card.innerText = course.name;

	card.addEventListener("click", () => {
		document.location = `/course/${course._id}`;
	})
	
	container?.appendChild(card);
}

export default function showCourses(courses: Course[]) {
	if (!document.getElementById("courses")) {
		const container = document.createElement("div");
		container.id = "courses";
		document.body.appendChild(container);
	}

	scrollListener((y: number, last_y: number) => {
		const container = document.getElementById("courses");

		if (y < last_y) {
			if (y < 200) {
				if (container?.classList.contains("scrolled")) {
					container?.classList.remove("scrolled");
				}

				return;
			}
		}

		if (y > 1) {
			if (!container?.classList.contains("scrolled")) {
				container?.classList.add("scrolled");
			}
		} else {
			if (container?.classList.contains("scrolled")) {
				container?.classList.remove("scrolled");
			}
		}
	})

	for (const course of courses) {
		createCourseElement(course);
	}
}
