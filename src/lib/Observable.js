// eslint-disable-next-line max-classes-per-file
import { cloneDeep } from "lodash-es";
import { deepFreeze } from "./object-helpers.js";

const DATA_UPDATED = "data-updated";

export class Observable extends EventTarget {
  constructor(initialValue) {
    super();
    this._value = deepFreeze(cloneDeep(initialValue));
  }

  get value() {
    return this._value;
  }

  update(callback) {
    const previousData = this.value;

    // create a mutable copy of the new data object
    const data = cloneDeep(this.value);

    callback(data);

    // create a copy of the mutated data to prevent references to nested consumer objects
    this._value = deepFreeze(cloneDeep(data));

    this.dispatchEvent(
      new CustomEvent(DATA_UPDATED, {
        detail: {
          data,
          previousData,
        },
      }),
    );
  }

  observe(callback) {
    const callBackWrapper = (e) => {
      const { data, previousData } = e.detail;
      callback(data, previousData);
    };

    callback(this.value, null);

    this.addEventListener(DATA_UPDATED, callBackWrapper);

    return new Subscription(() =>
      this.removeEventListener(DATA_UPDATED, callBackWrapper),
    );
  }
}

class Subscription {
  unsubscribe;

  constructor(unsubscribe) {
    this.unsubscribe = unsubscribe;
  }
}
