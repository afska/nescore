export default {
	getInput(emulator) {
		const gamepads = navigator
			.getGamepads()
			.filter((it) => it && it.mapping === "standard");

		const input = [this._createInput(), this._createInput()];

		if (gamepads.length > 0) this._setButtons(emulator, input[0], gamepads[0]);
		if (gamepads.length > 1) this._setButtons(emulator, input[1], gamepads[1]);

		return input;
	},

	_setButtons(emulator, input, gamepad) {
		input.BUTTON_A = gamepad.buttons[1].pressed;
		input.BUTTON_B = gamepad.buttons[0].pressed;
		input.BUTTON_SELECT = gamepad.buttons[8].pressed;
		input.BUTTON_START = gamepad.buttons[9].pressed;
		input.BUTTON_UP = gamepad.buttons[12].pressed;
		input.BUTTON_DOWN = gamepad.buttons[13].pressed;
		input.BUTTON_LEFT = gamepad.buttons[14].pressed;
		input.BUTTON_RIGHT = gamepad.buttons[15].pressed;

		if (gamepad.buttons[4].pressed) emulator.isDebugging = true;
		if (gamepad.buttons[6].pressed) emulator.isDebugging = false;
		if (gamepad.buttons[5].pressed && emulator.isDebugging)
			emulator.frame(true);
	},

	_createInput() {
		return {
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
};
