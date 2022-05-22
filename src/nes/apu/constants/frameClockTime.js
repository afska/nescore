const QUARTERS = [3729, 7457, 11186, 14916];

/** The NES APU frame counter (or frame sequencer) generates low-frequency clocks for the channels. */
export default {
	measure(frameClockCounter, onQuarter, onHalf, onEnd) {
		// TODO: 5-step sequencer?

		const isQuarter =
			frameClockCounter === QUARTERS[0] ||
			frameClockCounter === QUARTERS[1] ||
			frameClockCounter === QUARTERS[2] ||
			frameClockCounter === QUARTERS[3];
		const isHalf =
			frameClockCounter === QUARTERS[1] || frameClockCounter === QUARTERS[3];
		const isEnd = frameClockCounter === QUARTERS[3];

		if (isQuarter) onQuarter();
		if (isHalf) onHalf();
		if (isEnd) onEnd();
	}
};
