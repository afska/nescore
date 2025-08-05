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

		this.outputSample = 0;

		// DPCM:
		this.startFlag = false;
		this.isUsingDPCM = false;
		this.buffer = null;
		this.cursorByte = 0;
		this.cursorBit = 0;
		this.dividerCount = 0;
		this.samplePeriod = 0;
		this.sampleAddress = 0;
		this.sampleLength = 0;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = context.apu.registers.dmc;
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
			this.dividerCount = samplePeriod - 1;
			this.samplePeriod = samplePeriod;
			this.sampleAddress = this.registers.sampleAddress.absoluteAddress;
			this.sampleLength = this.registers.sampleLength.lengthInBytes;
			this.outputSample = 0;
		}

		return (
			(this.isUsingDPCM ? this._processDPCM(onIRQ) : this.outputSample) *
			config.DMC_CHANNEL_VOLUME
		);
	}

	/** Starts auto-playing a sample from `DMCSampleAddress` in DPCM mode. */
	startDPCM() {
		this.startFlag = true;
	}

	/** Stops DPCM, finishing the 1-byte buffer first. */
	stopDPCM() {
		this.cursorByte = this.sampleLength;
	}

	/** Returns the remaining bytes of the current DPCM sample. */
	get remainingBytes() {
		if (!this.isUsingDPCM) return 0;

		return this.sampleLength - this.cursorByte;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			outputSample: this.outputSample,
			startFlag: this.startFlag,
			isUsingDPCM: this.isUsingDPCM,
			buffer: this.buffer,
			cursorByte: this.cursorByte,
			cursorBit: this.cursorBit,
			dividerCount: this.dividerCount,
			samplePeriod: this.samplePeriod,
			sampleAddress: this.sampleAddress,
			sampleLength: this.sampleLength
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.outputSample = saveState.outputSample;
		this.startFlag = saveState.startFlag;
		this.isUsingDPCM = saveState.isUsingDPCM;
		this.buffer = saveState.buffer;
		this.cursorByte = saveState.cursorByte;
		this.cursorBit = saveState.cursorBit;
		this.dividerCount = saveState.dividerCount;
		this.samplePeriod = saveState.samplePeriod;
		this.sampleAddress = saveState.sampleAddress;
		this.sampleLength = saveState.sampleLength;
	}

	/** Returns whether the channel is enabled or not. */
	get isEnabled() {
		return this.context.apu.registers.apuControl.enableDMC;
	}

	_processDPCM(onIRQ) {
		this.dividerCount++;
		if (this.dividerCount >= this.samplePeriod) this.dividerCount = 0;
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

			let address = this.sampleAddress + this.cursorByte;
			if (address > 0xffff) {
				// (if it exceeds $FFFF, it is wrapped around to $8000)
				address = 0x8000 + (address % 0x10000);
			}
			this.buffer = this.context.cpu.memory.readAt(address);
		}

		const variation = Byte.getBit(this.buffer, this.cursorBit) ? 1 : -1;
		this.outputSample += variation;

		this.cursorBit++;
		if (hasSampleFinished && hasByteFinished && this.registers.control.loop)
			this.startDPCM();

		return this.outputSample;
	}
}
