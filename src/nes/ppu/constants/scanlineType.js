/** Returns the type of `scanLine`. */
export default (scanLine) => {
	if (this.scanline < 240) {
		return "VISIBLE";
	} else if (this.scanline === 241) {
		return "VBLANK_START";
	} else if (this.scanline === 261) {
		return "PRELINE";
	} else {
		return "IDLE";
	}
};
