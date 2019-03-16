import { InMemoryRegister } from "../../registers";

/**
 * PPU Scrolling Position Register (>> write twice)
 *
 * Change the scroll position,  to tell the PPU which pixel of the nametable
 * (selected through `PPUCtrl`) should be at the top left corner of the rendered screen.
 */

export default class PPUStatus extends InMemoryRegister {
	constructor() {
		super(0x2005);
	}
}
