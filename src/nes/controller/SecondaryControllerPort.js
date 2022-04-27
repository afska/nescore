import ControllerPort from "./ControllerPort";

/**
 * Secondary Controller Port Register (< read)
 *
 * Writing a value here affects the "strobe" flag (bit 0).
 * Games usually write 1, then 0, and then perform 8 consecutive reads to get the state of all buttons.
 */
export default class SecondaryControllerPort extends ControllerPort {
	constructor(primary) {
		super();

		this._primary = primary;
	}

	/** Returns the strobe flag. */
	get strobe() {
		return this._primary.strobe;
	}

	/** Writes nothing (read-only address). */
	writeAt() {}
}
