export default {
	updateInput(nes) {
		const gamepads = navigator
			.getGamepads()
			.filter((it) => it && it.mapping === "standard");

		if (gamepads.length > 0) this._setButtons(nes, 1, gamepads[0]);
		else nes.clearButtons(1);

		if (gamepads.length > 1) this._setButtons(nes, 2, gamepads[1]);
		else nes.clearButtons(2);
	},

	_setButtons(nes, player, gamepad) {
		nes.setButton(player, "BUTTON_A", gamepad.buttons[1].pressed);
		nes.setButton(player, "BUTTON_B", gamepad.buttons[0].pressed);
		nes.setButton(player, "BUTTON_SELECT", gamepad.buttons[8].pressed);
		nes.setButton(player, "BUTTON_START", gamepad.buttons[9].pressed);
		nes.setButton(player, "BUTTON_UP", gamepad.buttons[12].pressed);
		nes.setButton(player, "BUTTON_DOWN", gamepad.buttons[13].pressed);
		nes.setButton(player, "BUTTON_LEFT", gamepad.buttons[14].pressed);
		nes.setButton(player, "BUTTON_RIGHT", gamepad.buttons[15].pressed);
	}
};
