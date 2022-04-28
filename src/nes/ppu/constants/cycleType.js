/** Returns the type of `cycle`. */
export default (cycle) => {
	if (cycle === 0) {
		return "ZERO";
	} else if (cycle === 1) {
		return "ONE";
	} else if (cycle > 1 && cycle < 257) {
		return "VISIBLE";
	} else if (cycle === 257) {
		return "COPY_X";
	} else if (cycle === 258) {
		return "INCREMENT_Y";
	} else if (cycle === 259) {
		return "SPRITES";
	} else if (cycle > 279 && cycle < 305) {
		return "COPY_Y";
	} else if (cycle === 321) {
		return "FLUSH_TILEDATA";
	} else if (cycle > 321 && cycle < 337) {
		return "PREFETCH";
	} else if (cycle === 340) {
		return "MAPPER_TICK";
	} else {
		return "IDLE";
	}
};

// TODO: CLEAN
