export type EventBusEvent = (...args: unknown[]) => void;

export default class EventBus {
  #events: Map<string, EventBusEvent[]>;
  #preEmitQueue: Map<string, unknown[][]>;

  constructor() {
    this.#events = new Map();
    this.#preEmitQueue = new Map();
  }

  on(event: string, callback: EventBusEvent): void {
    let isNew = false;

    if (!this.#events.has(event)) {
      isNew = true;
      this.#events.set(event, []);
    }

    const events = this.#events.get(event) as EventBusEvent[];
    events.push(callback);

    if (isNew && this.#preEmitQueue.has(event)) {
      const preEmitQueue = this.#preEmitQueue.get(event) as unknown[][];
      preEmitQueue.forEach((args: unknown[]) => {
        callback(...args);
      });

      this.#preEmitQueue.delete(event);
    }
  }

  off(event: string, callback: EventBusEvent): void {
    if (!this.#events.has(event)) {
      return;
    }

    const events = this.#events.get(event) as EventBusEvent[];
    const index = events.indexOf(callback);

    if (index !== -1) {
      events.splice(index, 1);
    }
  }

  emit(event: string, ...args: unknown[]): void {
    if (this.#events.has(event)) {
      const events = this.#events.get(event) as EventBusEvent[];
      events.forEach((callback: EventBusEvent) => {
        callback(...args);
      });
    } else {
      if (!this.#preEmitQueue.has(event)) {
        this.#preEmitQueue.set(event, []);
      }

      const preEmitQueue = this.#preEmitQueue.get(event) as unknown[][];
      preEmitQueue.push(args);
    }
  }

  once(event: string, callback: EventBusEvent): void {
    const onceCallback = (...args: unknown[]) => {
      callback(...args);
      this.off(event, onceCallback);
    };

    this.on(event, onceCallback);
  }

  clear(): void {
    this.#events.clear();
    this.#preEmitQueue.clear();
  }

  removeEvent(event: string): void {
    this.#events.delete(event);
    this.#preEmitQueue.delete(event);
  }
}

if (import.meta.vitest) {
  const { expect, it, vi } = import.meta.vitest;

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
}
