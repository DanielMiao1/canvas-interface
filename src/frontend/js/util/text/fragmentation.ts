export function fragmentate(
	text: string,
	query_string: string,
	query_start_character = "{",
	query_end_character = "}"
) {
	let fragments: Record<string, string> = {};

	let text_index = 0;
	let query_index = 0;
	let piping_query = false;
	let current_query_name = "";

	while (text_index < text.length) {
		const text_character = text[text_index];
		const query_character = query_string[query_index];

		if (piping_query) {
			if (text_character === query_character) {
				const hypothetical_result = fragmentate(
					text.slice(text_index),
					query_string.slice(query_index)
				);

				if (hypothetical_result) {
					fragments = {
						...fragments,
						...hypothetical_result
					};

					break;
				}
			}

			fragments[current_query_name] += text_character;
			text_index++;

			continue;
		}

		if (text_character === query_character) {
			text_index++;
			query_index++;
		} else {
			if (query_character === query_start_character) {
				piping_query = true;

				const query_end_index = query_string.indexOf(
					query_end_character, query_index
				);

				current_query_name = query_string.slice(
					query_index + 1, query_end_index
				);
				fragments[current_query_name] = text_character;

				query_index = query_end_index + 1;
				text_index++;
			} else {
				return false;
			}
		}
	}

	return fragments;
}

export function deFragmentate(
	text: string,
	fragments: Record<string, string>,
	fragment_start_character = "[",
	fragment_end_character = "]"
) {
	let defragmentated_text = "";

	let index = 0;

	while (index < text.length) {
		const character = text[index];

		if (character === fragment_start_character) {
			const fragment_end_index = text.indexOf(fragment_end_character, index);
			const fragment_name = text.slice(index + 1, fragment_end_index);

			const replace_with = fragments[fragment_name];

			defragmentated_text += replace_with;

			index = fragment_end_index + 1;

			continue;
		}

		defragmentated_text += character;

		index++;
	}

	return defragmentated_text;
}
