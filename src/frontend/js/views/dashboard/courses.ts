import attachScrollThreshold from "../../scroll";

import { type CourseDataFragment } from "../../graphql/dashboard";

function createCourseElement(course: CourseDataFragment) {
	const container = document.getElementById("courses");

	const card = document.createElement("button");
	card.classList.add("course");
	card.title = `Course ${course._id}`;
	card.innerText = course.name;

	card.addEventListener("click", () => {
		document.location = `/course/${course._id}`;
	});

	container?.appendChild(card);
}

export default function showCourses(courses: CourseDataFragment[]) {
	if (!document.getElementById("courses")) {
		const container = document.createElement("div");
		container.id = "courses";
		document.body.appendChild(container);
	}

	attachScrollThreshold();

	for (const course of courses) {
		createCourseElement(course);
	}
}
