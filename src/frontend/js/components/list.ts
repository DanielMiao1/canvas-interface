type item_expander_function = (expansion_container: HTMLDivElement) => void;

export interface ListItemData {
	data?: Record<string, string>;
	expandable?: boolean;
	expander_function?: item_expander_function;
	primary_title: string;
	secondary_title?: string;
	tooltip?: string;
}

export interface ListData {
	items: ListItemData[];
	title: string;
}

function listItemClick(
	element: HTMLDivElement,
	expander_function: item_expander_function
) {
	if (element.classList.contains("expanded")) {
		if (element.children.length > 1) {
			element.children[1].remove();
		}

		element.classList.remove("expanded");
		return;
	}

	for (const expansion of document.getElementsByClassName("expanded")) {
		if (expansion.children.length > 1) {
			expansion.children[1].remove();
		}

		expansion.classList.remove("expanded");
	}

	const expansion_container = document.createElement("div");
	expansion_container.classList.add("list-expansion");
	element.appendChild(expansion_container);

	element.classList.add("expanded");
	expander_function(expansion_container);
}

export default function createList(container: HTMLElement, data: ListData) {
	const list = document.createElement("div");
	list.classList.add("list");

	const title = document.createElement("p");
	title.classList.add("list-title");
	title.innerText = data.title;
	list.appendChild(title);

	for (const item of data.items) {
		const element = document.createElement("div");
		element.classList.add("list-item");

		if (item.data) {
			for (const [name, value] of Object.entries(item.data)) {
				element.dataset[name] = value;
			}
		}

		const title_bar = document.createElement("div");
		title_bar.classList.add("list-item-title");

		if (item.expandable && typeof item.expander_function === "function") {
			const expander_function = item.expander_function;

			title_bar.addEventListener("click", () => {
				listItemClick(element, expander_function);
			});
		}

		const primary_title = document.createElement("p");
		primary_title.classList.add("list-primary-title");
		primary_title.innerText = item.primary_title;
		title_bar.appendChild(primary_title);

		if (item.secondary_title) {
			const secondary_title = document.createElement("p");
			secondary_title.classList.add("list-secondary-title");
			secondary_title.innerText = item.secondary_title;
			title_bar.appendChild(secondary_title);
		}

		element.appendChild(title_bar);

		list.appendChild(element);
	}

	container.appendChild(list);

	return list;
}
