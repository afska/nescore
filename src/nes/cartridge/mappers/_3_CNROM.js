import Mapper from "./Mapper";
import { WithCompositeMemory, MemoryMirror, MemoryPadding } from "../../memory";

/**
 * It provides bank-switching for CHR ROM only.
 * CPU $8000-$BFFF: 16 KB PRG ROM, fixed to the first page
 * CPU $C000-$FFFF: 16 KB PRG ROM, fixed to the second page (or mirror)
 * PPU $0000-$1FFF: 8 KB switchable CHR bank
 */
export default class CNROM extends Mapper {
	static get id() {
		return 3;
	}

	/** Creates a memory segment for CPU range $4020-$FFFF. */
	createCPUSegment({ cartridge }) {
		const unused = new MemoryPadding(0x3fe0);
		const prgRomFirstPage = this._newPrgBank();
		const prgRomLastPage =
			cartridge.header.prgRomPages === 2
				? this._newPrgBank(1)
				: new MemoryMirror(prgRomFirstPage, 0x4000);

		this._state = { page: 0 };

		return WithCompositeMemory.createSegment([
			//                  Address range   Size      Description
			unused, //          $4020-$7999     $3FE0     Unused space
			prgRomFirstPage, // $8000-$BFFF     $4000     PRG ROM (first 16KB of ROM)
			prgRomLastPage //   $C000-$FFFF     $4000     PRG ROM (second 16KB of ROM or mirror)
		]);
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment({ cartridge }) {
		return this._newChrBank(cartridge);
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		if (address >= 0x8000) {
			this._state.page = byte;
			this._loadBanks();
			return;
		}

		this.context.cpu.memory.writeAt(address, byte);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return { page: this._state.page };
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this._state.page = saveState.page;
		this._loadBanks();
	}

	_loadBanks() {
		this.segments.ppu.bytes = this._getChrPage(this._state.page);
	}
}
