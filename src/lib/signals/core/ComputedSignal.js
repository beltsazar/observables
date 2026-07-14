import { Signal } from "./Signal.js";
import { Watcher } from "./Watcher.js";

/**
 * ComputedSignal class that derives its value from other signals.
 * It automatically updates its value when any of the dependent signals change.
 */
export class ComputedSignal extends Signal {
  /**
   * @param {Signal | Signal[]} signals - The signal or array of signals to derive from.
   * @param {function} callback - The callback function that computes the value based on the signals. This callback should be a PURE function with no side effects.
   */
  constructor(signals, callback) {
    // initialize with the value computed by the callback.
    super(callback(signals));

    // create a watcher that will update the value when any of the signals change.
    this.watcher = new Watcher(signals, (signals) => {
      super.setValue(callback(signals));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  setValue() {
    throw new Error(
      "Cannot set value of a ComputedSignal directly. It is derived from other signals.",
    );
  }

  dispose() {
    this.watcher.dispose();
  }
}
