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

  update(callback) {
    const previousData = this.data;
    const data = cloneDeep(this.data);

    // let consumer callback change data
    callback(data);

    // commit the changed data
    this._data = deepFreeze(data);

    this.dispatchEvent(
      new CustomEvent("data-updated", {
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

    // call the callback immediately with the current data like RxJs BehaviorSubject
    callback(this.data, null);

    this.addEventListener("data-updated", callBackWrapper);
    return new Subscription(() =>
      this.removeEventListener("data-updated", callBackWrapper),
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
