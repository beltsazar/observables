export class Watcher extends EventTarget {
  constructor(signals, callback) {
    super();
    this.signals = signals;
    this.callback = callback;

    // convert possible single value to an array
    [this.signals].flat().forEach((signal) => signal.addWatcher(this));
    this.callback(this.signals);
  }

  // used by signal to notify the watcher of value changes
  notify(signal) {
    this.callback(this.signals, signal);
  }

  // unwatch all signals
  dispose() {
    [this.signals].flat().forEach((signal) => signal.removeWatcher(this));
  }
}
