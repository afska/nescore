/**
 * Creates an object from `items` with:
 * - `item.id` as keys
 * - `item` as values
 */
export default (items) => {
	return items.reduce((acum, elem) => {
		return { ...acum, [elem.id]: elem };
	}, {});
};
