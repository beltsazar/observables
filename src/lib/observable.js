import { isTargetObjectChildOfSourceObject } from './object-helpers.js'

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

    return this.addEventListener('update', (e) => {
      if (e.detail.target === target && e.detail.property === property) {
        callBack(e.detail)
        return
      }

      if (e.detail.target === target || isTargetObjectChildOfSourceObject(target, e.detail.target)) {
        callBack(e.detail)
      }
    })
  }
}
