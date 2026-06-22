import { ContextConsumer, ContextProvider } from "@lit/context";
// import { context } from "../context.js";

export const ContextProviderMixin = (superClass) =>
  class extends superClass {
    contextProvider;

    createContext(context, initialValue) {
      this.contextProvider = new ContextProvider(this, {
        context: context,
        initialValue,
      });
    }
  };

export const ContextConsumerMixin = (superClass) =>
  class extends superClass {
    contextConsumer;
    context; // should be set in the component that uses this mixin

    async connectedCallback() {
      super.connectedCallback();
      await this.mapContextAsync(this.context, (contextValue) => {
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
