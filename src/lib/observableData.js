import { cloneDeep, isEqual } from "lodash-es";
import { deepFreeze } from "./object-helpers.js";

export class ObservableData extends EventTarget {
  constructor(initialData) {
    super();
    // populate data object with new immutable deep clone
    this._data = deepFreeze(cloneDeep(initialData));
  }

  get data() {
    return this._data;
  }

  next(callBack) {
    const previousData = this.data;
    const data = cloneDeep(this.data);

    // mutate data with consumer callback
    callBack(data);

    // commit the mutated data as the current data
    this._data = deepFreeze(data);

    this.dispatchEvent(
      new CustomEvent("next", {
        detail: {
          data,
          previousData,
        },
      }),
    );
  }

  observe(observer) {
    const callBackWrapper = (e) => {
      const { data, previousData } = e.detail;
      observer(data, previousData);
    };

    this.addEventListener("next", callBackWrapper);
    return new Subscription(() =>
      this.removeEventListener("next", callBackWrapper),
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
