import constants from "../../constants";
import { WithContext, Byte } from "../../helpers";

const BASE_VOLUME = 0.01;

/**
 * The delta modulation channel (DMC) can output 1-bit delta-encoded samples (DPCM) or can
 * have its 7-bit counter directly loaded (PCM). This allows flexible manual sample playback.
 *
 * DPCM samples are stored as a stream of 1-bit deltas that control the 7-bit PCM counter that
 * the channel outputs. A bit of 1 will increment the counter, 0 will decrement, and it will clamp
 * rather than overflow if the 7-bit range is exceeded.
 */
export default class DMCChannel {
	constructor() {
		WithContext.apply(this);

		// DPCM variables:
		this.startFlag = false;
		this.isUsingDPCM = false;
		this.buffer = null;
		this.cursorByte = 0;
		this.cursorBit = 0;
		this.cursorDelta = 0;
		this.sampleLength = 0;
		this.outputSample = 0;
	}

	/** Generates a new sample. */
	sample() {
		// (the output level is sent to the mixer whether the channel is enabled or not)

		if (this.startFlag && this.buffer == null) {
			this.startFlag = false;
			this.isUsingDPCM = true;
			this.cursorByte = -1;
			this.cursorBit = 0;
			this.cursorDelta = constants.APU_DMC_DPCM_STEPS - 1;
			this.sampleLength = this.registers.sampleLength.lengthInBytes;
			this.outputSample = 0;
		}

		return (
			(this.isUsingDPCM
				? this._processDPCM()
				: this.registers.load.directLoad) * BASE_VOLUME
		);
	}

	/** Starts auto-playing a sample from `DMCSampleAddress`. */
	startDPCMIfNeeded() {
		if (this.remainingBytes === 0) this.startFlag = true;
	}

	/** Returns the remaining bytes of the current DPCM sample. */
	get remainingBytes() {
		if (!this.isUsingDPCM) return 0;

		return this.sampleLength - this.cursorByte;
	}

	/** Returns whether the channel is enabled or not. */
	get isEnabled() {
		return this.context.apu.registers.apuControl.enableDMC;
	}

	/** Returns the channel's register set. */
	get registers() {
		return this.context.apu.registers.dmc;
	}

	/** Returns the CPU memory bus. */
	get memory() {
		return this.context.memoryBus.cpu;
	}

	_processDPCM() {
		this.cursorDelta++;
		if (this.cursorDelta === constants.APU_DMC_DPCM_STEPS) this.cursorDelta = 0;
		else return this.outputSample;

		if (this.buffer === null || this.cursorBit === 8) {
			this.cursorByte++;
			this.cursorBit = 0;

			if (this.cursorByte === this.sampleLength) {
				this.isUsingDPCM = false;
				this.buffer = null;
				return 0;
			}

			let address =
				this.registers.sampleAddress.absoluteAddress + this.cursorByte;
			if (address > 0xffff) {
				// (if it exceeds $FFFF, it is wrapped around to $8000)
				address = 0x8000 + (address % 0xffff);
			}
			this.buffer = this.memory.readAt(address);
		}

		const variation = Byte.getBit(this.buffer, this.cursorBit) ? 1 : -1;
		this.outputSample += variation;

		this.cursorBit++;

		return this.outputSample;
	}
}
