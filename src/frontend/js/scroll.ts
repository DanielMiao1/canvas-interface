export function scrollListener(
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

export default function attachScrollThreshold(min_y = 200) {
	scrollListener((y: number, last_y: number) => {
		if (y < last_y) {
			if (y < min_y) {
				if (document.body.classList.contains("scrolled")) {
					document.body.classList.remove("scrolled");
				}

				return;
			}
		}

		if (y > 1) {
			if (!document.body.classList.contains("scrolled")) {
				document.body.classList.add("scrolled");
			}
		} else {
			if (document.body.classList.contains("scrolled")) {
				document.body.classList.remove("scrolled");
			}
		}
	});
}
