import { ContextConsumer, ContextProvider, createContext } from "@lit/context";

export const contextNew = createContext("signals");

export const ContextProviderMixin = (superClass) =>
  class extends superClass {
    contextProvider;

    initializeContext(initialValue) {
      this.contextProvider = new ContextProvider(this, {
        context: contextNew,
        initialValue,
      });
    }
  };

export const ContextConsumerMixin = (superClass) =>
  class extends superClass {
    contextConsumer;

    async connectedCallback() {
      super.connectedCallback();
      await this.mapContextAsync(contextNew, (contextValue) => {
        Object.assign(this, { ...contextValue });
      });
    }

    mapContext(context, mapper, resolver = null) {
      this.contextConsumer = new ContextConsumer(this, {
        context,
        callback: (context) => {
          mapper(context);
          resolver?.();
        },
      });
    }

    mapContextAsync(context, mapper) {
      let resolver;
      const deferredPromise = new Promise((resolve) => (resolver = resolve));
      this.mapContext(context, mapper, resolver);
      return deferredPromise;
    }
  };
