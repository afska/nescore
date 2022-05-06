/** Returns the type of `scanLine`. */
export default function scanlineType(scanLine) {
	if (scanLine === -1) {
		return "PRELINE";
	} else if (scanLine < 240) {
		return "VISIBLE";
	} else if (scanLine === 241) {
		return "VBLANK_START";
	} else {
		return "IDLE";
	}
}
