/** The game cartridge (a file in iNES format). */
export default class GameCartridge {
  constructor(bytes) {
    this.bytes = bytes;
  }

  /** Returns the header. It should be "NES". */
  get header() {
    return Array.from(this.bytes.slice(0, 3))
      .map((char) => String.fromCharCode(char))
      .join("");
  }
}
