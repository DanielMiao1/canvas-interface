export default function scrollListener(
	callback: (y: number, last_y: number) => unknown
) {
	let y = 0;
	let paused = false;

	window.addEventListener("scroll", () => {
		const last_y = y;
		y = window.scrollY;

		if (!paused) {
			paused = true;

			window.requestAnimationFrame(() => {
				paused = false;
				callback(y, last_y);
			});
		}
	});
}
