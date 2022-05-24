import { APURegisterSegment } from "./registers";
import {
	PulseChannel,
	TriangleChannel,
	NoiseChannel,
	DMCChannel
} from "./channels";
import frameClock from "./frameClock";
import { interrupts } from "../cpu/constants";
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
		this.channels.pulses[0].updateSweeper();
		this.channels.pulses[1].updateSweeper();

		this._incrementCounters();

		if (this.sampleCounter === 0) onSample(this.sample);

		return irq;
	}

	_onNewCycle = (onIRQ) => {
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
		this.sample = 0.5 * (pulse1 + pulse2 + triangle + noise + dmc);
	};

	_onQuarter = () => {
		// (quarter frame "beats" adjust the volume envelope)

		this.channels.pulses[0].fastClock();
		this.channels.pulses[1].fastClock();
		this.channels.triangle.fastClock();
		this.channels.noise.fastClock();
	};

	_onHalf = () => {
		// (half frame "beats" adjust the note length and frequency sweepers)

		this.channels.pulses[0].clock();
		this.channels.pulses[1].clock();
		this.channels.triangle.clock();
		this.channels.noise.clock();
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
