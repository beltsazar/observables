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

  update (callBack) {
    const oldData = this.data
    const newData = cloneDeep(this.data)

    // mutate data with consumer callback
    callBack(newData)

    // commit the mutated data as the current data
    this._data = deepFreeze(newData)

    this.dispatchEvent(new CustomEvent('updated', {
      detail: {
        newData,
        oldData
      },
    }),)
  }

  watch (callBack) {
    const callBackWrapper = (e) => {
      callBack(e.detail.newData, e.detail.oldData)
    }

    // execute the consumer callback to trigger the watcher with the initial data state
    callBack(this.data, null)

    this.addEventListener('updated', callBackWrapper)
    return new Subscription(() => this.removeEventListener('next', callBackWrapper))
  }
}

class Subscription {
  unwatch

  constructor (unwatch) {
    this.unwatch = unwatch
  }
}
