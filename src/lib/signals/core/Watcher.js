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
    // register a callback that will be called when the signal notifies
    const callBackWrapper = () => {
      callback(this.signals);
    };
    // call the callback once to initialize the value
    callback(this.signals);

    signal.addEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
    return () =>
      signal.removeEventListener(SIGNAL_NOTIFICATION, callBackWrapper);
  }

  dispose() {
    this.subscriptions.forEach((unwatch) => unwatch());
  }
}
