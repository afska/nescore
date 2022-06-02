import PrimaryControllerPort from "./PrimaryControllerPort";
import SecondaryControllerPort from "./SecondaryControllerPort";

/** An NES controller, which updates a `ControllerPort`. */
export default class Controller {
	constructor(port) {
		this.port = port;

		this.buttons = {
			BUTTON_A: false,
			BUTTON_B: false,
			BUTTON_SELECT: false,
			BUTTON_START: false,
			BUTTON_UP: false,
			BUTTON_DOWN: false,
			BUTTON_LEFT: false,
			BUTTON_RIGHT: false
		};
	}

	/** Creates a pair of connected controller ports. */
	static createPorts() {
		const primary = new PrimaryControllerPort();
		const secondary = new SecondaryControllerPort(primary);
		primary.setSecondary(secondary);

		return { primary, secondary };
	}

	/** Updates the state of a `button`, and writes the controller port. */
	update(button, isPressed) {
		this.buttons[button] = isPressed;
		this.port.value = this.toByte();
	}

	/** Clears the state of all buttons, and writes the controller port. */
	clear() {
		for (let button in this.buttons) this.buttons[button] = false;
		this.port.value = this.toByte();
	}

	/** Returns a binary representation of the current state. */
	toByte() {
		return (
			(this.buttons.BUTTON_A && 1 << 0) |
			(this.buttons.BUTTON_B && 1 << 1) |
			(this.buttons.BUTTON_SELECT && 1 << 2) |
			(this.buttons.BUTTON_START && 1 << 3) |
			(this.buttons.BUTTON_UP && 1 << 4) |
			(this.buttons.BUTTON_DOWN && 1 << 5) |
			(this.buttons.BUTTON_LEFT && 1 << 6) |
			(this.buttons.BUTTON_RIGHT && 1 << 7)
		);
	}
}
