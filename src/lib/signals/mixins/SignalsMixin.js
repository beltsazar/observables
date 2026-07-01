import { ContextConsumer, ContextProvider, createContext } from "@lit/context";
import { ComputedSignal } from "../core/ComputedSignal.js";
import { Watcher } from "../core/Watcher.js";
import { randomString } from "../utils/randomString.js";

const context = createContext(Symbol(randomString(10)));

export const SignalsMixin = (superClass) =>
  class extends superClass {
    #computedSignals = [];
    #watchers = [];

    provideSignals(signals) {
      new ContextProvider(this, {
        context,
        initialValue: signals,
      });
    }

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
      this.#computedSignals.forEach((computedSignal) =>
        computedSignal.dispose(),
      );
    }

    watch(signals, callback) {
      this.#watchers.push(new Watcher(signals, callback));
    }

    computed(signals, callback) {
      const computedSignal = new ComputedSignal(signals, callback);
      this.#computedSignals.push(computedSignal);
      return computedSignal;
    }

    registerComputed(computedSignal) {
      this.#computedSignals.push(computedSignal);
      return computedSignal;
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
