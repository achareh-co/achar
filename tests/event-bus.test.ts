import { expect, describe, it, vi } from 'vitest';
import { EventBus } from '../dist/index';

describe('Helpers', () => {
  it('emit one event', () => {
    const eventBus = new EventBus();

    // add event
    const callback = vi.fn();
    eventBus.on('event', callback);

    // emit event
    eventBus.emit('event');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('emit no event', () => {
    const eventBus = new EventBus();

    // add event
    const callback = vi.fn();
    eventBus.on('event', callback);

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('emit multiple events', () => {
    const eventBus = new EventBus();

    // add event1
    const callback1 = vi.fn();
    eventBus.on('event1', callback1);

    // add event1
    const callback2 = vi.fn();
    eventBus.on('event2', callback2);
    // add event1

    const callback3 = vi.fn();
    eventBus.on('event3', callback3);

    // emit event
    eventBus.emit('event1');
    eventBus.emit('event2');

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback3).toHaveBeenCalledTimes(0);
  });

  it('emit one event with multiple handlers', () => {
    const eventBus = new EventBus();

    // add event1
    const callback1 = vi.fn();
    eventBus.on('event', callback1);

    // add event1
    const callback2 = vi.fn();
    eventBus.on('event', callback2);

    // emit event
    eventBus.emit('event');

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('emitted event before add called after adding', () => {
    const eventBus = new EventBus();

    // emit event
    eventBus.emit('event');

    // add event1
    const callback1 = vi.fn();
    eventBus.on('event', callback1);

    // add event2
    const callback2 = vi.fn();
    eventBus.on('event', callback1);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(0);
  });

  it('use once for one-time event', () => {
    const eventBus = new EventBus();

    // add event1
    const callback = vi.fn();
    eventBus.once('event', callback);

    // emit event
    eventBus.emit('event');
    eventBus.emit('event');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('clear event-bus', () => {
    const eventBus = new EventBus();

    // add event1
    const callback1 = vi.fn();
    eventBus.on('event1', callback1);

    // add event1
    const callback2 = vi.fn();
    eventBus.on('event2', callback2);

    eventBus.clear();

    // emit event
    eventBus.emit('event1');
    eventBus.emit('event2');

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(0);
  });

  it('remove specific event', () => {
    const eventBus = new EventBus();

    // add event1
    const callback1 = vi.fn();
    eventBus.on('event1', callback1);

    // add event1
    const callback2 = vi.fn();
    eventBus.on('event2', callback2);

    eventBus.removeEvent('event1');

    // emit event
    eventBus.emit('event1');
    eventBus.emit('event2');

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('clear preEmitQueue for specific event', () => {
    const eventBus = new EventBus();

    // emit event
    eventBus.emit('event1');
    eventBus.emit('event2');

    // remove first event
    eventBus.removeEvent('event1');

    // add event1
    const callback1 = vi.fn();
    eventBus.on('event1', callback1);

    // add event1
    const callback2 = vi.fn();
    eventBus.on('event2', callback2);

    expect(callback1).toHaveBeenCalledTimes(0);
    expect(callback2).toHaveBeenCalledTimes(1);
  });
});
