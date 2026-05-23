import { cloneDeep } from 'lodash-es'
import { deepFreeze } from './object-helpers.js'

export class ObservableData extends EventTarget {
  constructor (initialData) {
    super()
    // populate data object with new immutable deep clone
    this._data = deepFreeze(cloneDeep(initialData))
  }

  get data () {
    return this._data
  }

  next (callBack) {
    const previousData = this.data
    const data = cloneDeep(this.data)

    // mutate data with consumer callback
    callBack(data)

    // commit the mutated data as the current data
    this._data = deepFreeze(data)

    this.dispatchEvent(new CustomEvent('next', {
      detail: {
        data,
        previousData
      },
    }),)
  }

  observe (observer, condition = (data, previousData) => true) {
    const callBackWrapper = (e) => {
      const { data, previousData } = e.detail
      if (condition(data, previousData)) {
        observer(data, previousData)
      }
    }

    // always execute the observer callback first time to for initialization purposes
    observer(this.data, null)

    this.addEventListener('next', callBackWrapper)
    return new Subscription(() => this.removeEventListener('next', callBackWrapper))
  }
}

class Subscription {
  unsubscribe

  constructor (unsubscribe) {
    this.unsubscribe = unsubscribe
  }
}
