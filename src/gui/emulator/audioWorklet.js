import RingBuffer from "ringbufferjs";
import config from "../../nes/config";

class PlayerWorklet extends AudioWorkletProcessor {
	constructor() {
		super();

		this.buffer = new RingBuffer(config.AUDIO_BUFFER_SIZE);

		this.port.onmessage = (event) => {
			for (let sample of event.data) this.buffer.enq(sample);
		};
	}

	process(inputs, outputs) {
		const output = outputs[0][0];
		const size = output.length;

		try {
			const samples = this.buffer.deqN(size);
			for (let i = 0; i < size; i++) output[i] = samples[i];
		} catch (e) {
			// buffer underrun (needed {size}, got {this.buffer.size()})
			// ignore empty buffers... assume audio has just stopped
			for (let i = 0; i < size; i++) output[i] = 0;
		}

		// request new samples
		this.port.postMessage(size);

		return true;
	}
}

registerProcessor("player-worklet", PlayerWorklet);
