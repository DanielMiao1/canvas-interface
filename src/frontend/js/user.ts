import apiRequest, { type User } from "./api";

let user_id: number;

export default async function getUserID() {
	if (user_id) {
		return user_id;
	}

	const request = await apiRequest("/api/users/self");
	const data: User = await request.json();

	user_id = data.id;

	return user_id;
}
