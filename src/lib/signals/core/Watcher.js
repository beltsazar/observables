import { SIGNAL_NOTIFICATION } from "./constants.js";

export class Watcher extends EventTarget {
  constructor(signals, callback) {
    super();
    this.signals = signals;
    this.subscriptions = new Set();
    // convert possible single value to an array
    [this.signals]
      .flat()
      .forEach((signal) =>
        this.subscriptions.add(this.watch(signal, callback)),
      );
  }

  watch(signal, callback) {
    const callBackWrapper = () => {
      callback(this.signals);
    };
    callback(this.signals);

    signal.addEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
    return () =>
      signal.removeEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
  }

  dispose() {
    this.subscriptions.forEach((unwatch) => unwatch());
  }
}
