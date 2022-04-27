import PrimaryControllerPort from "./PrimaryControllerPort";
import SecondaryControllerPort from "./SecondaryControllerPort";

const BITS = [
	0b00000001,
	0b00000010,
	0b00000100,
	0b00001000,
	0b00010000,
	0b00100000,
	0b01000000,
	0b10000000
];

/** Represents a NES controller. */
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
		this.port.value = this._toByte();
	}

	/** Clears the state of all buttons, and writes the controller port. */
	clear() {
		for (let button in this.buttons) this.buttons[button] = false;
		this.port.value = this._toByte();
	}

	_toByte() {
		return (
			(this.buttons.BUTTON_A && BITS[0]) |
			(this.buttons.BUTTON_B && BITS[1]) |
			(this.buttons.BUTTON_SELECT && BITS[2]) |
			(this.buttons.BUTTON_START && BITS[3]) |
			(this.buttons.BUTTON_UP && BITS[4]) |
			(this.buttons.BUTTON_DOWN && BITS[5]) |
			(this.buttons.BUTTON_LEFT && BITS[6]) |
			(this.buttons.BUTTON_RIGHT && BITS[7])
		);
	}
}
