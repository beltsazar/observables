import { cloneDeep, isEqual } from "lodash-es";
import { deepFreeze } from "./object-helpers.js";

export class ReactiveData extends EventTarget {
  constructor(initialData) {
    super();
    // populate data object with new immutable deep clone
    this._data = deepFreeze(cloneDeep(initialData));
  }

  get data() {
    return this._data;
  }

  act(actor) {
    const previousData = this.data;
    const data = cloneDeep(this.data);

    // mutate data with consumer callback
    actor(data);

    // commit the mutated data as the current data
    this._data = deepFreeze(data);

    this.dispatchEvent(
      new CustomEvent("action", {
        detail: {
          data,
          previousData,
        },
      }),
    );
  }

  react(reactor) {
    const callBackWrapper = (e) => {
      const { data, previousData } = e.detail;
      reactor(data, previousData);
    };

    this.addEventListener("action", callBackWrapper);
    return new Subscription(() =>
      this.removeEventListener("action", callBackWrapper),
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
