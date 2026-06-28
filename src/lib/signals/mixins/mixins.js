import { ContextConsumer, ContextProvider, createContext } from "@lit/context";
import { Watcher } from "../core/Watcher.js";

const context = createContext(Symbol("signals"));

export const SignalProviderMixin = (superClass) =>
  class extends superClass {
    #watchers = [];

    provideSignals(signals) {
      new ContextProvider(this, {
        context,
        initialValue: signals,
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.#watchers.forEach((watcher) => watcher.dispose());
    }

    watch(signals, callback) {
      this.#watchers.push(new Watcher(signals, callback));
    }
  };

export const SignalConsumerMixin = (superClass) =>
  class extends superClass {
    #watchers = [];
    signals;

    constructor() {
      super();
      this.signals = this.consumeSignals();
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
  };
