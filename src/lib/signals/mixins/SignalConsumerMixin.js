import { ContextConsumer } from "@lit/context";
import { context } from "./signals-context.js";
import { Watcher } from "../core/Watcher.js";

export const SignalConsumerMixin = (superClass) =>
  class extends superClass {
    #watchers = [];

    consumeSignals() {
      let promiseResolver;
      const deferredPromise = new Promise(
        (resolver) => (promiseResolver = resolver),
      );
      new ContextConsumer(this, {
        context,
        callback: (value) => {
          promiseResolver(value);
        },
      });
      return deferredPromise;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.#watchers.forEach((watcher) => watcher.dispose());
    }

    watch(signals, callback) {
      this.#watchers.push(new Watcher(signals, callback));
    }

    mapStateToSignals(map) {
      for (const [property, signal] of Object.entries(map)) {
        this.#watchers.push(
          new Watcher([signal], ([signal]) => {
            this[property] = signal.value;
          }),
        );
      }
    }
  };
