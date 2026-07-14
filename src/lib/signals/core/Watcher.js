/**
 * Watcher class that listens to changes in signals and calls a callback when they occur.
 */
export class Watcher {
  /**
   * @param {Signal | Signal[]} signals - The signal or array of signals to watch.
   * @param {function} callback - The callback function to be called when the signals change.
   */
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
