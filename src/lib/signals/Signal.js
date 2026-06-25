import { cloneDeep } from "lodash-es";
import { freezeDeep } from "./utils/freezeDeep.js";

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
      // let consumer callback mutate this copy
      valueOrCallback(newValue);
    } else {
      newValue = valueOrCallback;
    }

    this._previousValue = previousValue;
    // clone the consumer value to prevent nested consumer objects to be frozen :)
    this._value = freezeDeep(cloneDeep(newValue));

    this.dispatchEvent(
      new CustomEvent(SIGNAL_UPDATED, {
        detail: {
          signal: this,
        },
      }),
    );
  }
}
