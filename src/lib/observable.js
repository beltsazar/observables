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

  update (target, property, value) {
    // save a path to the target inside the current data object
    const persistedTargetPath = getPathsToTargetObject(this.data, target)[0]

    // replace the current version of data with a new cloned version
    this._data = cloneDeep(this.data)

    // retrieve the cloned target object, based on one of the saved paths
    const persistedTarget = get(this.data, persistedTargetPath, this.data)

    // save the old value and apply the update on the target
    const oldValue = persistedTarget[property]
    persistedTarget[property] = value

    deepFreeze(this.data)

    this.dispatchEvent(new CustomEvent('update', {
      detail: {
        target: persistedTarget, property, value, oldValue,
      },
    }),)
  }

  watch (target, property, callBack) {
    if (typeof property === 'function') {
      callBack = property
      property = null
    }

    // save a path to the target inside the current data object
    const persistedTargetPath = getPathsToTargetObject(this.data, target)[0]

    // wrap the user callback in a function for unsubscribing
    const callBackWrapper = (e) => {
      // retrieve the cloned target object, based on one of the saved paths
      const persistedTarget = get(this.data, persistedTargetPath, this.data)

      // both target object AND property match
      if (e.detail.target === persistedTarget && e.detail.property === property) {
        callBack(e.detail)
        return
      }

      // if updated target matches watched target or is a nested child of the watched target
      if (e.detail.target === persistedTarget || getPathsToTargetObject(persistedTarget, e.detail.target).length > 0) {
        callBack(e.detail)
      }
    }

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
