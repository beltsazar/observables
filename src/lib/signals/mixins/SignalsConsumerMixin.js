import { ContextConsumer } from "@lit/context";
import { context } from "./signals-context.js";
import { SignalsBaseMixin } from "./SignalsBaseMixin.js";

export const SignalsConsumerMixin = (superClass) =>
  class extends SignalsBaseMixin(superClass) {
    #contextConsumer = new ContextConsumer(this, { context });

    get sharedSignals() {
      return this.#contextConsumer.value;
    }
  };
