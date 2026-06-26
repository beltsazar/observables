import { ContextConsumer, ContextProvider, createContext } from "@lit/context";

export const context = createContext(Symbol("signals-context"));

export const ContextProviderMixin = (superClass) =>
  class extends superClass {
    contextProvider;

    initializeContext(initialValue) {
      this.contextProvider = new ContextProvider(this, {
        context,
        initialValue,
      });
    }
  };

export const ContextConsumerMixin = (superClass) =>
  class extends superClass {
    contextConsumer;

    async connectedCallback() {
      super.connectedCallback();
      await this.mapContextAsync((contextValue) => {
        Object.assign(this, { ...contextValue });
      });
    }

    mapContext(mapper, resolver = null) {
      this.contextConsumer = new ContextConsumer(this, {
        context,
        callback: (context) => {
          mapper(context);
          resolver?.();
        },
      });
    }

    mapContextAsync(mapper) {
      let resolver;
      const deferredPromise = new Promise((resolve) => (resolver = resolve));
      this.mapContext(mapper, resolver);
      return deferredPromise;
    }
  };
