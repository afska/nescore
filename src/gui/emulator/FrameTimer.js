const FPS = 60.098;
const SECOND = 1000;

export default class FrameTimer {
	constructor(onFrame, fps = FPS) {
		this.onFrame = onFrame;

		this._fps = fps;
		this._interval = SECOND / fps;
		this._lastTime = Date.now();
		this._startTime = this._lastTime;
		this._lastSecondTime = Date.now();
		this._lastSecondFrames = 0;
		this._isRunning = false;
	}

	start() {
		this._isRunning = true;
		this._run();
	}

	stop() {
		this._isRunning = false;
		cancelAnimationFrame(this._frameId);
	}

	_run = () => {
		if (!this._isRunning) return;
		this._frameId = requestAnimationFrame(this._run);

		const now = Date.now();
		const elapsedTime = now - this._lastTime;

		const elapsedTimeSinceLastSecond = now - this._lastSecondTime;
		if (elapsedTimeSinceLastSecond > SECOND) {
			document.querySelector("#fps").textContent = `(fps: ${
				this._lastSecondFrames
			})`;

			this._lastSecondTime = Date.now();
			this._lastSecondFrames = 0;
		}

		if (elapsedTime > this._interval) {
			this._lastTime = now - (elapsedTime % this._interval);
			this.onFrame();
			this._lastSecondFrames++;
		}
	};
}
