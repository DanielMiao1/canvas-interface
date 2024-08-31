const weekdays = [
	"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const abbreviated_months = [
	"Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.",
	"Sep.", "Oct.", "Nov.", "Dec."
];

export function timestampOf(time: string): number {
	return new Date(time).getTime();
}

export function formatTime(time: string): string {
	const date = new Date(time);

	const weekday = weekdays[date.getDay() - 1];
	const month = abbreviated_months[date.getMonth()];
	console.log(month)
	const day = date.getDate();

	return `${weekday} ${month} ${day}`;
}

export function dateNumber(time?: string): number {
	let date;

	if (time) {
		date = new Date(time);
	} else {
		date = new Date();
	}

	const year = date.getFullYear().toString().padStart(4, "0");
	const month = date.getMonth().toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");

	const date_string = year + month + day;

	return parseInt(date_string);
}
