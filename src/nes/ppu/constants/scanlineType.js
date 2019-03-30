/** Returns the type of `scanline`. */
export default (scanline) => {
	if (scanline < 240) {
		return "VISIBLE";
	} else if (scanline === 241) {
		return "VBLANK_START";
	} else if (scanline === 261) {
		return "PRELINE";
	} else {
		return "IDLE";
	}
};
