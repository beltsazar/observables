// eslint-disable-next-line max-classes-per-file
import { cloneDeep } from "lodash-es";
import { deepFreeze } from "./object-helpers.js";

const DATA_UPDATED = "data-updated";

export class ObservableData extends EventTarget {
  constructor(initialData) {
    super();
    this._data = deepFreeze(cloneDeep(initialData));
  }

  get data() {
    return this._data;
  }

  update(callback) {
    const previousData = this.data;

    // create a mutable copy of the new data object
    const data = cloneDeep(this.data);

    callback(data);

    // create a copy of the mutated data to prevent references to nested consumer objects
    this._data = deepFreeze(cloneDeep(data));

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

    callback(this.data, null);

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
