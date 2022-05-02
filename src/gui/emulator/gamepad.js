export default {
	updateInput(emulator) {
		const { nes } = emulator;

		const gamepads = navigator
			.getGamepads()
			.filter((it) => it && it.mapping === "standard");

		if (gamepads.length > 0) this._setButtons(emulator, 1, gamepads[0]);
		else nes.clearButtons(1);

		if (gamepads.length > 1) this._setButtons(emulator, 2, gamepads[1]);
		else nes.clearButtons(2);
	},

	_setButtons(emulator, player, gamepad) {
		const { nes } = emulator;

		nes.setButton(player, "BUTTON_A", gamepad.buttons[1].pressed);
		nes.setButton(player, "BUTTON_B", gamepad.buttons[0].pressed);
		nes.setButton(player, "BUTTON_SELECT", gamepad.buttons[8].pressed);
		nes.setButton(player, "BUTTON_START", gamepad.buttons[9].pressed);
		nes.setButton(player, "BUTTON_UP", gamepad.buttons[12].pressed);
		nes.setButton(player, "BUTTON_DOWN", gamepad.buttons[13].pressed);
		nes.setButton(player, "BUTTON_LEFT", gamepad.buttons[14].pressed);
		nes.setButton(player, "BUTTON_RIGHT", gamepad.buttons[15].pressed);

		if (gamepad.buttons[4].pressed) emulator.isDebugging = true;
		if (gamepad.buttons[6].pressed) emulator.isDebugging = false;
		if (gamepad.buttons[5].pressed && emulator.isDebugging)
			emulator.frame(true);
	}
};
