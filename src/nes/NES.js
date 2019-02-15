import CPU from "./CPU";
import GameCartridge from "./GameCartridge";

/* The NES Emulator. */
export default class NES {
	constructor() {
		this.cpu = new CPU();
		this.cartridge = null;
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom) {
		this.cartridge = new GameCartridge(rom);
		this.cpu.load(this.cartridge.prgROM);
	}

	/** Unloads the current cartridge. */
	unload() {
		this.cpu.unload();
		this.cartridge = null;
	}
}
