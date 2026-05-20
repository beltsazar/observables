import { getPathsToTargetObjectInSourceObject, isTargetObjectChildOfSourceObject } from './object-helpers.js'
import { get } from 'lodash-es'

export class Observable extends EventTarget {
  constructor (initialData) {
    super()
    this._data = initialData
  }

  get data () {
    return this._data
  }

  update (target, property, newValue) {
    const oldValue = target[property]
    target[property] = newValue

    this.dispatchEvent(
      new CustomEvent('update', {
        detail: {
          target,
          property,
          newValue,
          oldValue,
        },
      }),
    )
  }

  watch (target, property, callBack) {
    if (typeof property === 'function') {
      callBack = property
      property = null
    }

    const pathsToTarget = getPathsToTargetObjectInSourceObject(this.data, target)

    const callBackWrapper = (e) => {
      const targetByPath = get(this.data, pathsToTarget[0], this.data)
      const pathsToTargetEvent = getPathsToTargetObjectInSourceObject(this.data, e.detail.target)

      // console.log('pathsToTarget', pathsToTarget);
      // console.log('pathsToTargetEvent', pathsToTargetEvent);

      if (e.detail.target === targetByPath && e.detail.property === property) {
        callBack(e.detail)
        return
      }

      if (e.detail.target === targetByPath || isTargetObjectChildOfSourceObject(targetByPath, e.detail.target)) {
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
