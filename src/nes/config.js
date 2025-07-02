/** Compile-time options that change the emulator's behavior. */
export default {
	// [frontend]
	SYNC_TO_AUDIO: true,
	AUDIO_BUFFER_SIZE: 4096,
	AUDIO_DRIFT_THRESHOLD: 64,
	FPS: 60.098,

	// [emulator]
	BASE_VOLUME: 1,
	PULSE_CHANNEL_VOLUME: 1,
	TRIANGLE_CHANNEL_VOLUME: 1,
	NOISE_CHANNEL_VOLUME: 1,
	DMC_CHANNEL_VOLUME: 1,

	// [test]
	NESTEST_PATH: "./public/testroms/nestest.nes"
};
