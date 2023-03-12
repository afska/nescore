/** Compile-time options that change the emulator's behavior. */
export default {
	// [frontend]
	SYNC_TO_AUDIO: true,
	AUDIO_BUFFER_LIMIT: 4096,
	AUDIO_BUFFER_SIZE: 8192,
	FPS: 60.098,
	MASK_BORDERS: false,
	STATE_POLL_INTERVAL: 10,

	// [emulator]
	BASE_VOLUME: 0.5,
	MIN_FREQUENCY_CHANGE: 10,
	PULSE_CHANNEL_VOLUME: 1,
	TRIANGLE_CHANNEL_VOLUME: 1,
	NOISE_CHANNEL_VOLUME: 1,
	DMC_CHANNEL_VOLUME: 1,

	// [test]
	NESTEST_PATH: "./public/testroms/nestest.nes"
};
