import { type Course } from "./api";

function createCourseElement(course: Course) {
	const container = document.getElementById("courses");

	const card = document.createElement("button");
	card.classList.add("course");
	card.title = `Course ${course.id}`;
	card.innerText = course.name;
	
	container?.appendChild(card);
}

export default function showCourses(courses: Course[]) {
	if (!document.getElementById("courses")) {
		const container = document.createElement("div");
		container.id = "courses";
		document.body.appendChild(container);
	}

	for (const course of courses) {
		createCourseElement(course);
	}
}
