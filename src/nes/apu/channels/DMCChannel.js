import config from "../../config";
import { WithContext, Byte } from "../../helpers";

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

		// Direct Load:
		this.directLoadSample = 0;

		// DPCM:
		this.startFlag = false;
		this.isUsingDPCM = false;
		this.buffer = null;
		this.cursorByte = 0;
		this.cursorBit = 0;
		this.cursorDelta = 0;
		this.samplePeriod = 0;
		this.sampleLength = 0;
		this.outputSample = 0;
	}

	/** Generates a new sample. It calls `onIRQ` when a DPCM sample finishes (if IRQ flag is on). */
	sample(onIRQ) {
		// (the output level is sent to the mixer whether the channel is enabled or not)

		if (this.startFlag) {
			const samplePeriod = this.registers.control.dpcmPeriod;

			this.startFlag = false;
			this.isUsingDPCM = true;
			this.cursorByte = -1;
			this.cursorBit = 0;
			this.cursorDelta = samplePeriod - 1;
			this.samplePeriod = samplePeriod;
			this.sampleLength = this.registers.sampleLength.lengthInBytes;
			this.outputSample = 0;
		}

		return (
			(this.isUsingDPCM ? this._processDPCM(onIRQ) : this.directLoadSample) *
			config.DMC_CHANNEL_VOLUME
		);
	}

	/** Starts auto-playing a sample from `DMCSampleAddress`. */
	startDPCM() {
		this.startFlag = true;
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

	_processDPCM(onIRQ) {
		this.cursorDelta++;
		if (this.cursorDelta === this.samplePeriod) this.cursorDelta = 0;
		else return this.outputSample;

		const hasSampleFinished = this.cursorByte === this.sampleLength;
		const hasByteFinished = this.cursorBit === 8;

		if (this.buffer === null || hasByteFinished) {
			this.cursorByte++;
			this.cursorBit = 0;

			if (hasSampleFinished) {
				this.isUsingDPCM = false;
				this.buffer = null;
				if (this.registers.control.irqEnable) onIRQ("dmc");
				return 0;
			}

			let address =
				this.registers.sampleAddress.absoluteAddress + this.cursorByte;
			if (address > 0xffff) {
				// (if it exceeds $FFFF, it is wrapped around to $8000)
				address = 0x8000 + (address % 0xffff);
			}
			this.buffer = this._memoryBus.readAt(address);
		}

		const variation = Byte.getBit(this.buffer, this.cursorBit) ? 1 : -1;
		this.outputSample += variation;

		this.cursorBit++;
		if (hasSampleFinished && hasByteFinished && this.registers.control.loop)
			this.startDPCM();

		return this.outputSample;
	}

	get _memoryBus() {
		return this.context.memoryBus.cpu;
	}
}
