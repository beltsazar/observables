// eslint-disable-next-line max-classes-per-file
import { cloneDeep } from "lodash-es";
import { freezeDeep } from "./object-helpers.js";

const SIGNAL_UPDATED = "signal-updated";

export class Signal extends EventTarget {
  constructor(initialValue) {
    super();
    this._previousValue = undefined;
    this._value = freezeDeep(cloneDeep(initialValue));
  }

  get value() {
    return this._value;
  }

  get previousValue() {
    return this._previousValue;
  }

  setValue(valueOrCallback) {
    const previousValue = this.value;
    let newValue;

    if (valueOrCallback && typeof valueOrCallback === "function") {
      // create a mutable copy of the new data object
      newValue = cloneDeep(this.value);

      valueOrCallback(newValue);

      // create a copy of the mutated data to prevent references to nested consumer objects
      freezeDeep(cloneDeep(newValue));
    } else {
      newValue = valueOrCallback;
    }

    this._previousValue = previousValue;
    this._value = newValue;

    this.dispatchEvent(
      new CustomEvent(SIGNAL_UPDATED, {
        detail: {
          signal: this,
        },
      }),
    );
  }

  observe(callback) {
    const callBackWrapper = (e) => {
      const { signal } = e.detail;
      callback(signal);
    };

    callback(this);

    this.addEventListener(SIGNAL_UPDATED, callBackWrapper);

    return new Subscription(() =>
      this.removeEventListener(SIGNAL_UPDATED, callBackWrapper),
    );
  }
}

class Subscription {
  unsubscribe;

  constructor(unsubscribe) {
    this.unsubscribe = unsubscribe;
  }
}
