import mappers from "./mappers";
import constants from "../constants";
import { Byte } from "../helpers";

/** The game cartridge (a file in iNES format). */
export default class Cartridge {
	constructor(bytes) {
		this.bytes = bytes;

		if (this.magicNumber !== constants.ROM_MAGIC_NUMBER)
			throw new Error("Invalid ROM format.");
	}

	/** Returns a new instance of the right mapper. */
	createMapper() {
		const mapperId = this.header.mapperId;
		const Mapper = mappers[mapperId];
		if (!Mapper) throw new Error(`Unknown mapper: ${mapperId}.`);
		return new Mapper();
	}

	/** Returns the PRG ROM, which contains the game's code. */
	get prgRom() {
		return this._getBytes(this._programOffset, this._programSize);
	}

	/** Returns the CHR ROM buffer (which contains static tilesets) or a CHR RAM buffer. */
	get chrRom() {
		const offset = this._programOffset + this._programSize;
		const size = this.header.chrRomPages * constants.CHR_ROM_PAGE_SIZE;

		return !this.header.usesChrRam
			? this._getBytes(offset, size)
			: new Uint8Array(constants.CHR_RAM_PAGES * constants.CHR_ROM_PAGE_SIZE);
	}

	/** Returns the header data. */
	get header() {
		if (this.__header) return this.__header;

		const flags6 = this.bytes[6];
		const flags7 = this.bytes[7];

		const prgRomPages = this.bytes[4];
		const chrRomPages = this.bytes[5];
		if (prgRomPages === 0) throw new Error("Invalid header: No PRG ROM pages!");

		return (this.__header = {
			prgRomPages,
			chrRomPages: chrRomPages || constants.CHR_RAM_PAGES,
			usesChrRam: chrRomPages === 0,
			mirroring:
				Byte.getBit(flags6, 3) === 1
					? "FOUR_SCREENS"
					: Byte.getBit(flags6, 0) === 1
					? "VERTICAL"
					: "HORIZONTAL",
			hasTrainerBeforeProgram: !!Byte.getBit(flags6, 2),
			mapperId: Byte.setBits(
				Byte.getBits(flags6, 4, 4),
				4,
				4,
				Byte.getBits(flags7, 4, 4)
			)
		});
	}

	/** Returns the first 3 ASCII bytes of the header. It should return "NES". */
	get magicNumber() {
		return Array.from(this._getBytes(0, 3))
			.map((char) => String.fromCharCode(char))
			.join("");
	}

	_getBytes(offset, size) {
		return this.bytes.slice(offset, offset + size);
	}

	get _programOffset() {
		return (
			constants.ROM_HEADER_SIZE +
			(this.header.hasTrainerBeforeProgram ? constants.ROM_TRAINER_SIZE : 0)
		);
	}

	get _programSize() {
		return this.header.prgRomPages * constants.PRG_ROM_PAGE_SIZE;
	}
}
