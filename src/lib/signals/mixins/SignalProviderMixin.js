import { ContextProvider } from "@lit/context";
import { context } from "./signals-context.js";
import { Watcher } from "../core/Watcher.js";

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
