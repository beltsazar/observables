import { Signal } from "./Signal.js";
import { Watcher } from "./Watcher.js";

export class ComputedSignal extends Signal {
  constructor(signals = [], callback) {
    super(callback(signals));

    this.watcher = new Watcher(signals, (signals, signal) => {
      this.setValue(callback(signals, signal));
    });
  }

  unwatch() {
    this.watcher.unwatch();
  }
}
