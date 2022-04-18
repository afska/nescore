import { InMemoryRegister } from "../../registers";

/**
 * PPU Data Port (<> read/write)
 *
 * Read/Write VRAM data here. `PPUAddr` will be incremented after the operation.
 */
export default class PPUData extends InMemoryRegister {}
