import { cloneDeep, isEqual } from "lodash-es";
import { deepFreeze } from "./object-helpers.js";

const DATA_CHANGED = "data-changed";

export class ObservableData extends EventTarget {
  constructor(initialData) {
    super();
    // populate data object with new immutable deep clone
    this._data = deepFreeze(cloneDeep(initialData));
  }

  get data() {
    return this._data;
  }

  action(callback, action = null) {
    const previousData = this.data;
    const data = cloneDeep(this.data);

    // let consumer callback change data
    callback(data);

    // commit the changed data
    this._data = deepFreeze(data);

    this.dispatchEvent(
      new CustomEvent(DATA_CHANGED, {
        detail: {
          data,
          previousData,
          action,
        },
      }),
    );
  }

  observe(callback, observeAction) {
    const callBackWrapper = (e) => {
      const { data, previousData, action } = e.detail;
      if (!observeAction || observeAction === action) {
        callback(data, previousData);
      }
    };

    this.addEventListener(DATA_CHANGED, callBackWrapper);
    return new Subscription(() =>
      this.removeEventListener(DATA_CHANGED, callBackWrapper),
    );
  }

  isChanged(data, previousData) {
    return !isEqual(data, previousData);
  }
}

class Subscription {
  unsubscribe;

  constructor(unsubscribe) {
    this.unsubscribe = unsubscribe;
  }
}
