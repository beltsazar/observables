import { SIGNAL_NOTIFICATION } from "./constants.js";

export class Watcher extends EventTarget {
  constructor(signals, callback) {
    super();
    this.isMultipleSignalsArgument = Array.isArray(signals);
    this.signals = this.isMultipleSignalsArgument ? signals : [signals];
    this.callback = callback;
    this._subscriptions = new Set();
    this.signals.forEach((signal) => {
      const subscription = this.watch(signal, callback);
      this._subscriptions.add(subscription);
    });
  }

  watch(signal, callback) {
    const signals = this.isMultipleSignalsArgument
      ? this.signals
      : this.signals[0];
    const callBackWrapper = () => {
      callback(signals);
    };
    callback(signals);

    signal.addEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
    return () =>
      signal.removeEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
  }

  dispose() {
    this._subscriptions.forEach((unwatch) => unwatch());
  }
}
