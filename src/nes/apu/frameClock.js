const QUARTERS_4_STEP = [3729, 7457, 11186, 14916];
const QUARTERS_5_STEP = [3729, 7457, 11186, 18641];

/** The NES APU frame counter (or frame sequencer) generates low-frequency clocks for the channels. */
export default {
	measure(
		frameClockCounter,
		use5StepSequencer,
		onIRQ,
		onQuarter,
		onHalf,
		onEnd
	) {
		const quarters = use5StepSequencer ? QUARTERS_5_STEP : QUARTERS_4_STEP;

		const isQuarter =
			frameClockCounter === quarters[0] ||
			frameClockCounter === quarters[1] ||
			frameClockCounter === quarters[2] ||
			frameClockCounter === quarters[3];
		const isHalf =
			frameClockCounter === quarters[1] || frameClockCounter === quarters[3];
		const isEnd = frameClockCounter === quarters[3];

		if (isQuarter) onQuarter();
		if (isHalf) onHalf();
		if (isEnd) {
			onEnd();
			if (!use5StepSequencer) onIRQ("frame");
		}
	}
};
