const NES_CONSTANT = "NES";
const KB = 1024;
const HEADER_SIZE = 16;
const TRAINER_SIZE = 512;
const PRG_ROM_PAGE_SIZE = 16 * KB;
const CHR_ROM_PAGE_SIZE = 8 * KB;

/** The game cartridge (a file in iNES format). */
export default class GameCartridge {
  constructor(bytes) {
    this.bytes = bytes;

    if (this.nesConstant !== NES_CONSTANT)
      throw new Error("Invalid ROM format.");
  }

  /** Returns the PRG ROM, which contains the game's code. */
  get prgROM() {
    return this.getBytes(this._programOffset, this._programSize);
  }

  /** Returns the CHR ROM, which contains static tilesets, or null. */
  get chrROM() {
    const offset = this._programOffset + this._programSize;
    const size = this.header.chrROMPages * CHR_ROM_PAGE_SIZE;

    return size > 0 ? this.getBytes(offset, size) : null;
  }

  /** Returns the header data. */
  get header() {
    if (this.__header) return this.__header;

    const flags = this.bytes[6];

    return (this.__header = {
      prgROMPages: this.bytes[4],
      chrROMPages: this.bytes[5],
      hasTrainerBeforeProgram: !!(flags & 0b00000100),
      mirroringMode: flags & 0b00000001
    });
  }

  /** Returns the first 3 ASCII bytes of the header. It should return "NES". */
  get nesConstant() {
    return Array.from(this.getBytes(0, 3))
      .map((char) => String.fromCharCode(char))
      .join("");
  }

  /** Returns `size` bytes from the `offset` of the ROM data. */
  getBytes(offset, size) {
    return this.bytes.slice(offset, offset + size);
  }

  get _programOffset() {
    return (
      HEADER_SIZE + (this.header.hasTrainerBeforeProgram ? TRAINER_SIZE : 0)
    );
  }

  get _programSize() {
    return this.header.prgROMPages * PRG_ROM_PAGE_SIZE;
  }
}
