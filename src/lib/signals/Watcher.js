import { SIGNAL_NOTIFICATION } from "./constants.js";

export class Watcher extends EventTarget {
  constructor(signals, callback) {
    super();
    this.isMultipleSignals = Array.isArray(signals);
    this.signals = this.isMultipleSignals ? signals : [signals];
    this.callback = callback;
    this._subscriptions = new Set();

    this.signals.forEach((signal) => {
      const subscription = this.watch(signal, callback);
      this._subscriptions.add(subscription);
    });
  }

  watch(signal, callback) {
    const callBackWrapper = (e) => {
      const { signal } = e.detail;
      if (this.isMultipleSignals) {
        callback(this.signals, signal);
      } else {
        callback(signal);
      }
    };

    if (this.isMultipleSignals) {
      callback(this.signals, null);
    } else {
      callback(this.signals[0]);
    }

    signal.addEventListener(SIGNAL_NOTIFICATION, callBackWrapper);

    return () =>
      signal.removeEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
  }

  unwatch() {
    this._subscriptions.forEach((unwatch) => unwatch());
  }
}
