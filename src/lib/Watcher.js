const SIGNAL_UPDATED = "signal-updated";

export class Watcher extends EventTarget {
  constructor(signals = [], callback) {
    super();
    this.signals = signals;
    this.callback = callback;
    this._subscriptions = new Set();

    signals.forEach((signal) => {
      const subscription = this.watch(signal, callback);
      this._subscriptions.add(subscription);
    });
  }

  watch(signal, callback) {
    const callBackWrapper = (e) => {
      const { signal } = e.detail;
      callback(this.signals, signal);
    };

    callback(this.signals, null);

    signal.addEventListener(SIGNAL_UPDATED, callBackWrapper);

    return () => signal.removeEventListener(SIGNAL_UPDATED, callBackWrapper);
  }

  unwatch() {
    this._subscriptions.forEach((unwatch) => unwatch());
  }
}
