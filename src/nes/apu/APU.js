import { APURegisterSegment } from "./registers";
import { PulseChannel, TriangleChannel, NoiseChannel } from "./channels";
import { frameClockTime } from "./constants";
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

		this.registers = null;

		this.channels = {
			pulses: [
				new PulseChannel(0, "enablePulse1"),
				new PulseChannel(1, "enablePulse2")
			],
			triangle: new TriangleChannel(),
			noise: new NoiseChannel()
		};
		// TODO: DMC CHANNEL
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = new APURegisterSegment(context);

		this.channels.pulses[0].loadContext(context);
		this.channels.pulses[1].loadContext(context);
		this.channels.triangle.loadContext(context);
		this.channels.noise.loadContext(context);

		this._reset();
	}

	/**
	 * Executes the next step (1 step = 1 PPU cycle = 0.16 APU cycles).
	 * It calls `onAudioSample` when it generates a new sample.
	 */
	step(onAudioSample) {
		if (this.clockCounter === 0) this._onNewCycle();

		// (frequency sweepers change at high frequency)
		this.channels.pulses[0].updateSweeper();
		this.channels.pulses[1].updateSweeper();

		this._incrementCounters();

		if (this.sampleCounter === 0) onAudioSample(this.sample);
	}

	_onNewCycle = () => {
		frameClockTime.measure(
			this.frameClockCounter,
			this._onQuarter,
			this._onHalf,
			this._onEnd
		);

		const pulse1 = this.channels.pulses[0].sample();
		const pulse2 = this.channels.pulses[1].sample();
		const triangle = this.channels.triangle.sample();
		const noise = this.channels.noise.sample();
		this.sample = 0.5 * (pulse1 + pulse2 + triangle + noise);
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
		if (this.sampleCounter === constants.APU_STEPS_PER_SAMPLE) {
			this.sampleCounter = 0;
			this.time += 1 / constants.APU_SAMPLE_RATE;
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
	}
}
