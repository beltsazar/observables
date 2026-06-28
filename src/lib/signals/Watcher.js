import { SIGNAL_NOTIFICATION } from "./constants.js";

export class Watcher extends EventTarget {
  constructor(signalOrArray, callback) {
    super();
    this.isSignalsAsArray = Array.isArray(signalOrArray);
    this.signals = this.isSignalsAsArray ? signalOrArray : [signalOrArray];
    this.callback = callback;
    this.subscriptions = new Set();
    // subscribe an observer to each signal
    this.signals.forEach((signal) =>
      this.subscriptions.add(this.watch(signal, callback)),
    );
  }

  watch(signal, callback) {
    const signals = this.isSignalsAsArray ? this.signals : this.signals[0];
    const callBackWrapper = () => {
      callback(signals);
    };
    callback(signals);

    signal.addEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
    return () =>
      signal.removeEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
  }

  dispose() {
    this.subscriptions.forEach((unwatch) => unwatch());
  }
}
