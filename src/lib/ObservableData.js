import { cloneDeep, isEqual } from "lodash-es";
import { deepFreeze } from "./object-helpers.js";

export class ObservableData extends EventTarget {
  constructor(initialData) {
    super();
    // populate data object with new immutable deep clone
    this._data = deepFreeze(cloneDeep(initialData));
  }

  static DEFAULT_ACTION_NAME = "data-changed";

  get data() {
    return this._data;
  }

  action(callback, actionName = null) {
    const previousData = this.data;
    const data = cloneDeep(this.data);

    // let consumer callback change data
    callback(data);

    // commit the changed data
    this._data = deepFreeze(data);

    this.dispatchEvent(
      new CustomEvent(actionName, {
        detail: {
          data,
          previousData,
        },
      }),
    );

    // if a specific action was provided, trigger specific event for specific observers
    if (actionName) {
      this.dispatchEvent(
        new CustomEvent(actionName, {
          detail: {
            data,
            previousData,
          },
        }),
      );
    }

    // always trigger the default data change event for non-specific observers
    this.dispatchEvent(
      new CustomEvent(ObservableData.DEFAULT_ACTION_NAME, {
        detail: {
          data,
          previousData,
        },
      }),
    );
  }

  observe(callback, actionName = ObservableData.DEFAULT_ACTION_NAME) {
    const callBackWrapper = (e) => {
      const { data, previousData } = e.detail;
      callback(data, previousData);
    };

    this.addEventListener(actionName, callBackWrapper);
    return new Subscription(() =>
      this.removeEventListener(actionName, callBackWrapper),
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
