import { ContextConsumer, ContextProvider } from "@lit/context";

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

    mapContext(context, mapper) {
      this.contextConsumer = new ContextConsumer(this, {
        context,
        callback: (context) => mapper(context),
      });
    }
  };
