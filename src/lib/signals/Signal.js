import { cloneDeep, isEqual } from "lodash-es";
import { freezeDeep } from "./utils/freezeDeep.js";
import { SIGNAL_NOTIFICATION } from "./constants.js";

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
    const currentValue = this.value;
    let newValue;

    if (valueOrCallback && typeof valueOrCallback === "function") {
      // create a mutable copy of the new data object
      newValue = cloneDeep(currentValue);
      // let consumer callback mutate this copy
      valueOrCallback(newValue);
    } else {
      newValue = valueOrCallback;
    }

    // notify only when the next value differs from the current value
    if (!isEqual(newValue, currentValue)) {
      // the current value becomes the previous value before we update the current value
      this._previousValue = currentValue;
      // clone the consumer value to prevent nested consumer objects to be frozen :(=)
      this._value = freezeDeep(cloneDeep(newValue));
      // notify event listeners
      this.dispatchEvent(new Event(SIGNAL_NOTIFICATION));
    }
  }
}
