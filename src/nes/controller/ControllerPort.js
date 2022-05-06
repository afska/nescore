import { InMemoryRegister } from "../registers";
import constants from "../constants";
import { Byte } from "../helpers";

/**
 * Controller Port Register
 *
 * If the "strobe" flag is active, reads return the current state of the A button.
 * If not, reads return the current state of [A, B, Select, Start, Up, Down, Left, Right] in a loop.
 */
export default class ControllerPort extends InMemoryRegister {
	constructor() {
		super();

		this.cursor = 0;
	}

	/** Returns the strobe flag. */
	get strobe() {
		throw new Error("not_implemented");
	}

	/** Reads the current buton state, and updates the cursor if the strobe flag is on. */
	readAt() {
		if (this.cursor >= constants.BUTTONS) return 1;

		const isPressed = Byte.getBit(this.value, this.cursor);
		if (!this.strobe) this.cursor++;

		return isPressed;
	}
}
