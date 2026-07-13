export class Watcher {
  constructor(signals, callback) {
    this.signals = signals;
    this.callback = callback;
    // convert possible single value to an array
    [this.signals].flat().forEach((signal) => signal.addWatcher(this));
    // provide the initial value to the callback immediately
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
