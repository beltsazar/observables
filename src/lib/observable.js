import { get, cloneDeep } from 'lodash-es'
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

  update (callBack) {
    const newData = cloneDeep(this.data)

    callBack(newData)

    this.dispatchEvent(new CustomEvent('update', {
      detail: {
        data: newData,
        oldData: this.data
      },
    }),)

    this._data = newData
    deepFreeze(this._data)
  }

  watch (callBack) {
    const callBackWrapper = (e) => {
      callBack(e.detail.data, e.detail.oldData)
    }

    callBack(this.data)

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
