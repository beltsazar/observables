import { Signal } from "./Signal.js";
import { Watcher } from "./Watcher.js";

export class ComputedSignal extends Signal {
  constructor(signals, callback) {
    // initialize with the value computed by the callback.
    super(callback(signals));

    this.watcher = new Watcher(signals, (signals) => {
      super.setValue(callback(signals));
    });
  }

  setValue() {
    throw new Error(
      "Cannot set value of a ComputedSignal directly. It is derived from other signals.",
    );
  }

  dispose() {
    this.watcher.dispose();
  }
}
