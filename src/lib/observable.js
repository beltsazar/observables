import { cloneDeep } from 'lodash-es'
import {
  getPathsToTargetObject, deepFreeze
} from './object-helpers.js'

export class Observable extends EventTarget {
  constructor (initialData) {
    super()
    // populate data object with new immutable deep clone
    this._data = deepFreeze(cloneDeep(initialData))
  }

  get data () {
    return this._data
  }

  update (updateCallBack) {
    const data = this.data
    const nextData = cloneDeep(this.data)

    // mutate data with consumer callback
    updateCallBack(nextData)

    // commit the mutated data as the current data
    this._data = deepFreeze(nextData)

    this.dispatchEvent(new CustomEvent('update', {
      detail: {
        data: this.data,
        previousData: data
      },
    }),)
  }

  watch (observerCallBack) {
    const callBackWrapper = (e) => {
      observerCallBack(e.detail.data, e.detail.previousData)
    }

    // execute the consumer callback function immediately without having to wait for an update
    observerCallBack(this.data, null)

    this.addEventListener('update', callBackWrapper)
    return new Watcher(() => this.removeEventListener('update', callBackWrapper))
  }
}

class Watcher {
  unwatch

  constructor (unwatch) {
    this.unwatch = unwatch
  }
}
