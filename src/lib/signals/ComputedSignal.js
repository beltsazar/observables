import { Signal } from "./Signal.js";
import { Watcher } from "./Watcher.js";

export class ComputedSignal extends Signal {
  constructor(signals, callback) {
    // Initialize with the value computed by the callback.
    super(callback(signals, null));

    this.watcher = new Watcher(signals, (signals, signal) => {
      super.setValue(callback(signals, signal));
    });
  }

  setValue() {
    throw new Error(
      "Cannot set value of a ComputedSignal directly. It is derived from other signals.",
    );
  }

  unwatch() {
    this.watcher.unwatch();
  }
}
