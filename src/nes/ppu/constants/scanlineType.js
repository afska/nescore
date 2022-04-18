/** Returns the type of `scanLine`. */
export default (scanLine) => {
	if (scanLine < 240) {
		return "VISIBLE";
	} else if (scanLine === 241) {
		return "VBLANK_START";
	} else if (scanLine === 261) {
		return "PRELINE";
	} else {
		return "IDLE";
	}
};
