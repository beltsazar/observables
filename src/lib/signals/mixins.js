import { ContextConsumer, ContextProvider, createContext } from "@lit/context";
import { Watcher } from "./Watcher.js";

const context = createContext(Symbol("signals-context"));

export const SignalProviderMixin = (superClass) =>
  class extends superClass {
    #contextProvider;
    #watchers = [];

    injectSignals(signals) {
      this.#contextProvider = new ContextProvider(this, {
        context,
        initialValue: signals,
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.#watchers.forEach((watcher) => watcher.unwatch());
    }

    watch(signals, callback) {
      this.#watchers.push(new Watcher(signals, callback));
    }
  };

export const SignalConsumerMixin = (superClass) =>
  class extends superClass {
    #contextConsumer;
    #promiseResolver;
    #watchers = [];
    signals;
    signalsAsync = new Promise(
      (resolver) => (this.#promiseResolver = resolver),
    );

    connectedCallback() {
      super.connectedCallback();
      this.#contextConsumer = new ContextConsumer(this, {
        context,
        callback: (value) => {
          this.signals = value;
          this.#promiseResolver(value);
        },
      });
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.#watchers.forEach((watcher) => watcher.unwatch());
    }

    watch(signals, callback) {
      this.#watchers.push(new Watcher(signals, callback));
    }

    mapStateToSignals(map) {
      for (const [property, signal] of Object.entries(map)) {
        new Watcher([signal], ([signal]) => {
          this[property] = signal.value;
          // make sure that changes trigger a render update in the component
          // this.requestUpdate();
        });
      }
    }
  };
