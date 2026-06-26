import { ContextConsumer, ContextProvider, createContext } from "@lit/context";

const context = createContext(Symbol("signals-context"));

export const SignalProviderMixin = (superClass) =>
  class extends superClass {
    #contextProvider;

    injectSignals(signals) {
      this.#contextProvider = new ContextProvider(this, {
        context,
        initialValue: signals,
      });
    }
  };

export const SignalConsumerMixin = (superClass) =>
  class extends superClass {
    #contextConsumer;
    #asyncSignalsResolver;
    signals;
    asyncSignals = new Promise(
      (resolver) => (this.#asyncSignalsResolver = resolver),
    );

    connectedCallback() {
      super.connectedCallback();

      this.#contextConsumer = new ContextConsumer(this, {
        context,
        callback: (value) => {
          this.signals = value;
          this.#asyncSignalsResolver(value);
        },
      });
    }
  };
