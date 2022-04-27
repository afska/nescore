import ControllerPort from "./ControllerPort";
import { Byte } from "../helpers";

const STROBE_BIT = 0;

/**
 * Primary Controller Port Register (<> read/write)
 *
 * Writing a value here affects the "strobe" flag (bit 0).
 * Games usually write 1, then 0, and then perform 8 consecutive reads to get the state of all buttons.
 */
export default class PrimaryControllerPort extends ControllerPort {
	constructor() {
		super();

		this._strobe = false;
		this._secondary = null;
	}

	/** Returns the strobe flag. */
	get strobe() {
		return this._strobe;
	}

	/** Sets a `secondary` controller port, that will be affected by the strobe flag. */
	setSecondary(secondary) {
		this._secondary = secondary;
	}

	/** Writes the strobe flag, potentially resetting the cursor. */
	writeAt(__, byte) {
		this._strobe = Byte.getBit(byte, STROBE_BIT) === 1;
		if (this._strobe) {
			this.cursor = 0;
			if (this._secondary) this._secondary.cursor = 0;
		}
	}
}
