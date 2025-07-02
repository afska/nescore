import { APURegisterSegment } from "./registers";
import {
	PulseChannel,
	TriangleChannel,
	NoiseChannel,
	DMCChannel
} from "./channels";
import frameClock from "./frameClock";
import { interrupts } from "../cpu/constants";
import config from "../config";
import constants from "../constants";
import { WithContext } from "../helpers";

const STEPS_PER_SAMPLE = Math.floor(
	constants.FREQ_PPU_HZ /
		constants.APU_HIGH_FREQUENCY_CYCLES /
		constants.APU_SAMPLE_RATE
);

/** The Audio Processing Unit. It generates audio samples. */
export default class APU {
	constructor() {
		WithContext.apply(this);

		this.sampleCounter = 0;
		this.frameClockCounter = 0;
		this.sample = 0;
		this.frameIRQFlag = false;

		this.registers = null;

		this.channels = {
			pulses: [
				new PulseChannel(0, "enablePulse1"),
				new PulseChannel(1, "enablePulse2")
			],
			triangle: new TriangleChannel(),
			noise: new NoiseChannel(),
			dmc: new DMCChannel()
		};

		this._onQuarter = this._onQuarter.bind(this);
		this._onHalf = this._onHalf.bind(this);
		this._onEnd = this._onEnd.bind(this);
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = new APURegisterSegment(context);

		this.channels.pulses[0].loadContext(context);
		this.channels.pulses[1].loadContext(context);
		this.channels.triangle.loadContext(context);
		this.channels.noise.loadContext(context);
		this.channels.dmc.loadContext(context);

		this._reset();
	}

	/**
	 * Executes the next step (1 step = 1 APU cycle).
	 * Returns an interrupt or null.
	 * It calls `onSample` when it generates a new sample.
	 */
	step(onSample) {
		let irq = null;
		const onIRQ = (type) => {
			if (type === "frame") {
				if (!this.registers.apuFrameCounter.interruptInhibitFlag) {
					this.frameIRQFlag = true;
					irq = interrupts.IRQ;
				}
			} else irq = interrupts.IRQ;
		};

		this._onNewCycle(onIRQ);
		this._incrementCounters();

		if (this.sampleCounter === 0) onSample(this.sample);

		return irq;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			sampleCounter: this.sampleCounter,
			frameClockCounter: this.frameClockCounter,
			sample: this.sample,
			frameIRQFlag: this.frameIRQFlag,
			pulse1: this.channels.pulses[0].getSaveState(),
			pulse2: this.channels.pulses[1].getSaveState(),
			triangle: this.channels.triangle.getSaveState(),
			noise: this.channels.noise.getSaveState(),
			dmc: this.channels.dmc.getSaveState()
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.sampleCounter = saveState.sampleCounter;
		this.frameClockCounter = saveState.frameClockCounter;
		this.sample = saveState.sample;
		this.frameIRQFlag = saveState.frameIRQFlag;
		this.channels.pulses[0].setSaveState(saveState.pulse1);
		this.channels.pulses[1].setSaveState(saveState.pulse2);
		this.channels.triangle.setSaveState(saveState.triangle);
		this.channels.noise.setSaveState(saveState.noise);
		this.channels.dmc.setSaveState(saveState.dmc);
	}

	_onNewCycle(onIRQ) {
		this.channels.pulses[0].cycle();
		this.channels.pulses[1].cycle();

		frameClock.measure(
			this.frameClockCounter,
			this.registers.apuFrameCounter.use5StepSequencer,
			onIRQ,
			this._onQuarter,
			this._onHalf,
			this._onEnd
		);

		const isNewSample = this.sampleCounter + 1 === STEPS_PER_SAMPLE;
		const pulse1 = this.channels.pulses[0].sample(isNewSample); // 0 ~ 15
		const pulse2 = this.channels.pulses[1].sample(isNewSample); // 0 ~ 15
		const triangle = this.channels.triangle.sample(isNewSample); // 0 ~ 15
		const noise = this.channels.noise.sample(); // 0 ~ 15
		const dmc = this.channels.dmc.sample(onIRQ); // 0 ~ 127

		// (APU mixer from nesdev)
		const pulseOut = 0.00752 * (pulse1 + pulse2);
		const tndOut = 0.00851 * triangle + 0.00494 * noise + 0.00335 * dmc;

		this.sample = config.BASE_VOLUME * (pulseOut + tndOut);
	}

	_onQuarter() {
		// (quarter frame "beats" adjust the volume envelope and triangle's linear length counter)

		this.channels.pulses[0].quarterBeat();
		this.channels.pulses[1].quarterBeat();
		this.channels.triangle.quarterBeat();
		this.channels.noise.quarterBeat();
	}

	_onHalf() {
		// (half frame "beats" adjust the note length and frequency sweepers)

		this.channels.pulses[0].halfBeat();
		this.channels.pulses[1].halfBeat();
		this.channels.triangle.halfBeat();
		this.channels.noise.halfBeat();
	}

	_onEnd() {
		this.frameClockCounter = 0;
	}

	_incrementCounters() {
		this.sampleCounter++;
		this.frameClockCounter++;

		if (this.sampleCounter === STEPS_PER_SAMPLE) this.sampleCounter = 0;
	}

	_reset() {
		this.sampleCounter = 0;
		this.frameClockCounter = 0;
		this.sample = 0;
		this.frameIRQFlag = false;
	}
}
