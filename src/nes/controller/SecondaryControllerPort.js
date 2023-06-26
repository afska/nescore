import ControllerPort from "./ControllerPort";

/**
 * Secondary Controller Port Register (< read)
 *
 * Writing a value here does nothing.
 * Reads work using the Primary Controller Port's strobe flag.
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
