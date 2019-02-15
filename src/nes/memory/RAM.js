import Memory from "./Memory";

const KB = 1024;
const TOTAL_MEMORY = 2 * KB;
const START_ADDRESS = 0x0000;
const END_ADDRESS = 0x07ff;

export default class RAM extends Memory {
	constructor() {
		super(TOTAL_MEMORY, START_ADDRESS, END_ADDRESS);
	}
}
