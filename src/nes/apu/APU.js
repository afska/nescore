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

/** The Audio Processing Unit. It generates audio samples. */
export default class APU {
	constructor() {
		WithContext.apply(this);

		this.time = 0;
		this.clockCounter = 0;
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
	 * Executes the next step (1 step = 1 PPU cycle = 0.16 APU cycles).
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

		if (this.clockCounter === 0) this._onNewCycle(onIRQ);

		// (frequency sweepers change at high frequency)
		this.channels.pulses[0].step();
		this.channels.pulses[1].step();

		this._incrementCounters();

		if (this.sampleCounter === 0) onSample(this.sample);

		return irq;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			time: this.time,
			clockCounter: this.clockCounter,
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
		this.time = saveState.time;
		this.clockCounter = saveState.clockCounter;
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

		const pulse1 = this.channels.pulses[0].sample();
		const pulse2 = this.channels.pulses[1].sample();
		const triangle = this.channels.triangle.sample();
		const noise = this.channels.noise.sample();
		const dmc = this.channels.dmc.sample(onIRQ);
		this.sample =
			config.BASE_VOLUME * (pulse1 + pulse2 + triangle + noise + dmc);
	}

	_onQuarter = () => {
		// (quarter frame "beats" adjust the volume envelope and triangle's linear length counter)

		this.channels.pulses[0].quarterBeat();
		this.channels.pulses[1].quarterBeat();
		this.channels.triangle.quarterBeat();
		this.channels.noise.quarterBeat();
	};

	_onHalf = () => {
		// (half frame "beats" adjust the note length and frequency sweepers)

		this.channels.pulses[0].halfBeat();
		this.channels.pulses[1].halfBeat();
		this.channels.triangle.halfBeat();
		this.channels.noise.halfBeat();
	};

	_onEnd = () => {
		this.frameClockCounter = 0;
	};

	_incrementCounters() {
		this.clockCounter++;

		this.sampleCounter++;

		if (this.sampleCounter === this._stepsPerSample) {
			this.sampleCounter = 0;
			this.time += 1 / this.context.nes.sampleRate;
		}

		if (this.clockCounter === constants.PPU_CYCLES_PER_APU_CYCLE) {
			this.clockCounter = 0;
			this.frameClockCounter++;
		}
	}

	_reset() {
		this.time = 0;
		this.clockCounter = 0;
		this.sampleCounter = 0;
		this.frameClockCounter = 0;
		this.sample = 0;
		this.frameIRQFlag = false;
	}

	get _stepsPerSample() {
		return Math.floor(
			constants.FREQ_PPU_AND_APU_HZ / this.context.nes.sampleRate
		);
	}
}
