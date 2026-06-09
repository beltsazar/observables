import { ContextConsumer, ContextProvider, createContext } from "@lit/context";

export const context = createContext("feature-component");

export const ContextProviderMixin = (superClass) =>
  class extends superClass {
    contextProvider;

    createContext(initialValue) {
      this.contextProvider = new ContextProvider(this, {
        context,
        initialValue,
      });
    }
  };

export const ContextConsumerMixin = (superClass) =>
  class extends superClass {
    contextConsumer;

    mapContext(mapper) {
      this.contextConsumer = new ContextConsumer(this, {
        context,
        callback: (context) => mapper(context),
      });
    }
  };
