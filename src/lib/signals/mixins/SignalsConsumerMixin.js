import { ContextConsumer } from "@lit/context";
import { context } from "./signals-context.js";
import { ComputedSignal } from "../core/ComputedSignal.js";
import { Watcher } from "../core/Watcher.js";

export const SignalsConsumerMixin = (superClass) =>
  class extends superClass {
    #contextConsumer = new ContextConsumer(this, { context });
    #computedSignals = [];
    #watchers = [];

    get sharedSignals() {
      return this.#contextConsumer.value;
    }

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

    disconnectedCallback() {
      super.disconnectedCallback();
      this.#watchers.forEach((watcher) => watcher.dispose());
      this.#computedSignals.forEach((computedSignal) =>
        computedSignal.dispose(),
      );
    }
  };
