import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Beat } from '../lib/beat.js';

describe('Beat', () => {
  let cb;
  let beat;

  beforeEach(() => {
    cb = vi.fn();
    beat = new Beat(cb, 60);
    vi.useFakeTimers();
    global.requestAnimationFrame = vi.fn((fn) => setTimeout(() => fn(performance.now()), 16));
    global.cancelAnimationFrame = vi.fn((id) => clearTimeout(id));
  });

  it('Should initialize with callback and FPS', () => {
    expect(beat._cb).toBe(cb);
    expect(beat._fpsInterval).toBeCloseTo(1000 / 60);
    expect(beat.running).toBe(false);
  });

  it('Should start and call the callback', () => {
    beat.start();
    expect(beat.running).toBe(true);
    // Simulate enough time for a frame
    vi.advanceTimersByTime(beat._fpsInterval * 2);
    expect(cb).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('Should pause and resume', () => {
    beat.start();
    beat.pause();
    expect(beat.running).toBe(false);
    beat.resume();
    expect(beat.running).toBe(true);
  });

  it('Should stop and clear the callback', () => {
    beat.start();
    beat.stop();
    expect(beat._cb).toBeNull();
    expect(beat._onFrame).toBeNull();
    expect(beat.running).toBe(false);
  });

  it('Should increment frameCount on each frame', () => {
    beat.start();
    const initialCount = beat._frameCount;
    vi.advanceTimersByTime(beat._fpsInterval * 3);
    expect(beat._frameCount).toBeGreaterThan(initialCount);
  });

  it('Should return correct running state', () => {
    expect(beat.running).toBe(false);
    beat.start();
    expect(beat.running).toBe(true);
    beat.pause();
    expect(beat.running).toBe(false);
  });

  it('Should return correct time since start', () => {
    beat.start();
    vi.advanceTimersByTime(100);
    beat.frame(performance.now());
    expect(beat.time).toBeGreaterThanOrEqual(0);
  });

  it('Should calculate currentFps', () => {
    beat._previousTime = 0;
    beat._currentTime = 16.67;
    expect(beat.currentFps).toBeCloseTo(60, 0);
  });
});
