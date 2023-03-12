const DEBUG_MODE = window.location.search === "?debug";

export default {
	getInput() {
		const gamepads = navigator
			.getGamepads()
			.filter((it) => it && it.mapping === "standard");

		const input = [this.createInput(), this.createInput()];

		if (gamepads.length === 0) return null;
		if (gamepads.length > 0) this._setButtons(input[0], gamepads[0]);
		if (gamepads.length > 1) this._setButtons(input[1], gamepads[1]);

		return input;
	},

	createInput() {
		return {
			BUTTON_A: false,
			BUTTON_B: false,
			BUTTON_SELECT: false,
			BUTTON_START: false,
			BUTTON_UP: false,
			BUTTON_DOWN: false,
			BUTTON_LEFT: false,
			BUTTON_RIGHT: false,

			$saveState: false,
			$loadState: false,
			$startDebugging: false,
			$stopDebugging: false,
			$debugStepFrame: false,
			$debugStepScanline: false
		};
	},

	_setButtons(input, gamepad) {
		input.BUTTON_A = gamepad.buttons[1].pressed;
		input.BUTTON_B = gamepad.buttons[0].pressed;
		input.BUTTON_SELECT = gamepad.buttons[8].pressed;
		input.BUTTON_START = gamepad.buttons[9].pressed;
		input.BUTTON_UP = gamepad.buttons[12].pressed;
		input.BUTTON_DOWN = gamepad.buttons[13].pressed;
		input.BUTTON_LEFT = gamepad.buttons[14].pressed;
		input.BUTTON_RIGHT = gamepad.buttons[15].pressed;

		input.$saveState = gamepad.buttons[2].pressed;
		input.$loadState = gamepad.buttons[3].pressed;
		input.$startDebugging = DEBUG_MODE && gamepad.buttons[4].pressed;
		input.$stopDebugging = DEBUG_MODE && gamepad.buttons[6].pressed;
		input.$debugStepFrame = DEBUG_MODE && gamepad.buttons[5].pressed;
		input.$debugStepScanline = DEBUG_MODE && gamepad.buttons[7].pressed;
	}
};
