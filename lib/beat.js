/**
 * The Beat class will call the callback function at the given [frame rate]{@link https://en.wikipedia.org/wiki/Frame_rate}
 * defined by the <code>fps</code> argument (frames per second or times per second).
 * <br>
 * It tries to honors the given <code>fps</code> value, so consecutive calls to the callback function will run at the same
 * speed regardless on the performance of the device or the refresh rate of the screen. However, to ensure a consistent animation,
 * be sure to use the <code>delta</code> argument passed to the callback function to calculate how much the animation
 * will progress in a frame.
 */
export class Beat {
    /**
     * Creates a new instance of the Beat object.
     * @param {function} [cb] - The function to be called at the given frame rate. It receives two arguments: the time since it started,
     * and the elapsed time since the previous frame (or delta time).
     * @param {Number} [fps=60] - The integer number of times to call the callback function per second (frames per second).
     * Must be an integer.
     */
    constructor(cb, fps = 60) {
        this._cb = cb;
        this._fpsInterval = 1000 / fps;
		this._frameCount = 0;
        this._running = false;
    }
    
    /**
     * Starts the frame-by-frame loop by internally calling to [requestAnimationFrame()]{@link https://developer.mozilla.org/en/docs/Web/API/Window/requestAnimationFrame}.
     * The callback function will be called the <code>fps</code> number of times per second.
     */
    start() {
        this._startTime = performance.now();
        this._previousTime = this._startTime;
        this._previousDeltaTime = this._startTime;
        this._pausedTime = 0;
        this._running = true;
        // Wrapper to keep the scope (faster than .bind()?)
        this._onFrame = (currentTime) => this.frame(currentTime);
        this.frame(this._startTime);
    }
    
    /**
     * Pauses the frame-by-frame loop.
     */
    pause() {
        this._running = false;
        this._previousPauseTime = performance.now();
    }
    
    /**
     * Resumes the frame-by-frame loop.
     */
    resume() {
        const now = performance.now();
        this._pausedTime += now - this._previousPauseTime;
        this._running = true;
        this.frame(now);
    }
    
    /**
     * Stops the frame-by-frame loop and removes the callback function. Further calls to {@linkcode Beat#start} will fail.
     */
    stop() {
        this.pause();
        this._cb = null;
        this._onFrame = null;
		cancelAnimationFrame(this._timerID);
    }
    
    /**
     * The <code>frame()</code> method is called before the browser performs the next repaint, then it calls the callback function.
     * Beat will ensure that the callback function is called no more than <code>fps</code> number of times per second.
     * <br>
     * To keep the same speed in your animation, be sure to use the <code>delta</code> argument to calculate how much the
     * animation will progress in a frame.
     */
    frame(currentTime) {
        if (!this._running) {
            return;
        }
        currentTime -= this._pausedTime;
        // Calculate elapsed time since last loop
        let delta = currentTime - this._previousDeltaTime;
        // If enough time has elapsed, draw the next frame
        if (delta >= this._fpsInterval) {
            // Adjust next execution time in case this frame took longer to execute
            this._previousDeltaTime = currentTime - (delta % this._fpsInterval);
            this._cb(currentTime, currentTime - this._previousTime);
            this._previousTime = currentTime;
			this._frameCount++;
        }
        if (this._onFrame) {
            this._timerID = requestAnimationFrame(this._onFrame);
        }
    }
    
    /**
     * Returns whether the instance is running or not.
     * @type {Boolean}
     */
    get running() {
        return this._running;
    }
    
    /**
     * Returns the time since the Beat started.
     * @type {DOMHighResTimeStamp}
     */
    get time() {
        return this._previousTime - this._startTime;
    }
	
    /**
     * Returns the current frame rate (number of frames per second).
     * @type {Number}
     */
	get currentFps() {
		return 1000 / (this._currentTime - this._previousTime);
	}
}
