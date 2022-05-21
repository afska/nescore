const QUARTERS = [3729, 7457, 11186, 14916];

export default {
	measure(frameClockCounter, onQuarter, onHalf, onEnd) {
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
