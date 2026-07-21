import { ComputedSignal } from "../core/ComputedSignal.js";
import { Watcher } from "../core/Watcher.js";

export const SignalsBaseMixin = (superClass) =>
  class extends superClass {
    #computedSignals = [];
    #watchers = [];

    watch(signals, callback) {
      this.#watchers.push(new Watcher(signals, callback));
    }

    computed(signals, callback) {
      const computedSignal = new ComputedSignal(signals, callback);
      this.#computedSignals.push(computedSignal);
      return computedSignal;
    }

    mapStateToSignals(map) {
      for (const [property, signal] of Object.entries(map)) {
        this.#watchers.push(
          new Watcher(signal, () => {
            this[property] = signal.value;
          }),
        );
      }
    }

    cleanupSignalObservers() {
      this.#watchers.forEach((watcher) => watcher.dispose());
      this.#computedSignals.forEach((computedSignal) =>
        computedSignal.dispose(),
      );
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.cleanupSignalObservers();
    }
  };
