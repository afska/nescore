const instructions = () => [
	/**
	 * No Operation
	 *
	 * Causes no changes at all.
	 */
	{
		id: "NOP",
		needsValue: false,
		execute: (context) => {}
	}
];

export default instructions();
