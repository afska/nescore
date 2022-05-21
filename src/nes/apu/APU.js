import { APURegisterSegment } from "./registers";
import { Oscillator, Counter } from "./synthesis";
import { frameClockTime } from "./constants";
import constants from "../constants";
import { WithContext, Byte } from "../helpers";

/** The Audio Processing Unit. It generates audio samples. */
export default class APU {
	constructor() {
		WithContext.apply(this);

		this.time = 0;
		this.clockCounter = 0;
		this.sampleCounter = 0;
		this.frameClockCounter = 0;

		this.oscillator = new Oscillator();
		this.oscillator2 = new Oscillator();
		this.lengthCounters = [new Counter(), new Counter()];
		this.registers = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = new APURegisterSegment(context);

		this._reset();
	}

	/**
	 * Executes the next step (1 step = 1 PPU cycle = 0.16 APU cycles).
	 * It calls `onAudioSample` when it generates a new sample.
	 */
	step(onAudioSample) {
		if (this.clockCounter === 0) this._onNewCycle();

		// Frequency sweepers change at high frequency
		// pulse1_sweep.track(pulse1_seq.reload);
		// pulse2_sweep.track(pulse2_seq.reload);

		this._incrementCounters();

		if (this.sampleCounter === 0) onAudioSample(this.output);
	}

	_onNewCycle = () => {
		frameClockTime.measure(
			this.frameClockCounter,
			this._onQuarter,
			this._onHalf,
			this._onEnd
		);

		const fCPU = constants.FREQ_CPU_HZ; // from nesdev: f = fCPU / (16 * (t + 1))

		const timer1 = Byte.to16Bit(
			this.registers.pulses[0].lclTimerHigh.timerHigh,
			this.registers.pulses[0].timerLow.value
		);
		this.oscillator.amplitude = 0.15;
		this.oscillator.harmonics = 20;
		this.oscillator.dutyCycle = this.registers.pulses[0].control.dutyCycle;
		this.oscillator.frequency = fCPU / (16 * (timer1 + 1));
		const sample1 =
			this.registers.apuControl.enablePulse1 && !this.lengthCounters[0].hasDone
				? this.oscillator.sample(this.time)
				: 0;

		const timer2 = Byte.to16Bit(
			this.registers.pulses[1].lclTimerHigh.timerHigh,
			this.registers.pulses[1].timerLow.value
		);
		this.oscillator2.amplitude = 0.15;
		this.oscillator2.harmonics = 20;
		this.oscillator2.dutyCycle = this.registers.pulses[1].control.dutyCycle;
		this.oscillator2.frequency = fCPU / (16 * (timer2 + 1));
		const sample2 =
			this.registers.apuControl.enablePulse2 && !this.lengthCounters[1].hasDone
				? this.oscillator2.sample(this.time)
				: 0;

		this.output = 0.5 * (sample1 + sample2);

		// if (pulse1_lc.counter > 0 && pulse1_seq.timer >= 8 && !pulse1_sweep.mute && pulse1_env.output > 2)
		// 	pulse1_output += (pulse1_sample - pulse1_output) * 0.5;
		// else
		// 	pulse1_output = 0;
	};

	_onQuarter = () => {
		// (quarter frame "beats" adjust the volume envelope)

		this.__ = 2;
		// pulse1_env.clock(pulse1_halt);
		// pulse2_env.clock(pulse2_halt);
		// noise_env.clock(noise_halt);
	};

	_onHalf = () => {
		// (half frame "beats" adjust the note length and frequency sweepers)

		this.lengthCounters[0].clock(
			this.registers.apuControl.enablePulse1,
			this.registers.pulses[0].control.halt
		);
		this.lengthCounters[1].clock(
			this.registers.apuControl.enablePulse2,
			this.registers.pulses[1].control.halt
		);
		// pulse1_lc.clock(pulse1_enable, pulse1_halt); OK
		// pulse2_lc.clock(pulse2_enable, pulse2_halt); OK
		// noise_lc.clock(noise_enable, noise_halt);
		// pulse1_sweep.clock(pulse1_seq.reload, 0);
		// pulse2_sweep.clock(pulse2_seq.reload, 1);
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
	}
}
