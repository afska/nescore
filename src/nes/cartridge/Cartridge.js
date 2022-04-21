import { Byte } from "../helpers";
import mappers from "./mappers";
import constants from "../constants";

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

	/** Returns the CHR ROM, which contains static tilesets, or null. */
	get chrRom() {
		const offset = this._programOffset + this._programSize;
		const size = this.header.chrRomPages * constants.CHR_ROM_PAGE_SIZE;

		return size > 0 ? this._getBytes(offset, size) : null;
	}

	/** Returns the header data. */
	get header() {
		if (this.__header) return this.__header;

		const flags6 = this.bytes.readUInt8(6);
		const flags7 = this.bytes.readUInt8(7);

		return (this.__header = {
			prgRomPages: this.bytes.readUInt8(4),
			chrRomPages: this.bytes.readUInt8(5),
			hasTrainerBeforeProgram: !!Byte.getBit(flags6, 2),
			mapperId: Byte.setSubNumber(
				Byte.getSubNumber(flags6, 4, 4),
				4,
				4,
				Byte.getSubNumber(flags7, 4, 4)
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
