import apiRequest from "../../api/api";
import attachScrollThreshold from "../../scroll";
import createBackButton from "../../components/back_button";
import showModules from "./modules";

import { fragmentateUrl } from "../../routing";

import course_query, { type CourseQueryData } from "../../graphql/course";

export default async function courseView() {
	import("../../../css/views/course.scss").catch(() => {
		console.error("Failed to load css file");
	});

	createBackButton();

	const url_data = fragmentateUrl("/course/{id}");
	if (!url_data) {
		throw new Error("Could not retrieve course id");
	}

	const course_id = url_data.id;

	const request = await apiRequest(course_query, {
		courseId: course_id
	}) as CourseQueryData;

	const data = request.course;

	const title = document.createElement("h1");
	title.innerText = data.name;

	attachScrollThreshold();

	document.body.appendChild(title);

	showModules(data.modulesConnection.nodes);
}
