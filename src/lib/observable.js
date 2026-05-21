import { cloneDeep } from 'lodash-es'
import { deepFreeze } from './object-helpers.js'

export class Observable extends EventTarget {
  constructor (initialValue) {
    super()
    // populate data object with new immutable deep clone
    this._value = deepFreeze(cloneDeep(initialValue))
  }

  get value () {
    return this._value
  }

  next (callBack) {
    const value = this.value
    const nextValue = cloneDeep(this.value)

    // mutate data with consumer callback
    callBack(nextValue)

    // commit the mutated data as the current data
    this._value = deepFreeze(nextValue)

    this.dispatchEvent(new CustomEvent('next', {
      detail: {
        value: this.value,
        previousValue: value
      },
    }),)
  }

  observe (callBack) {
    const callBackWrapper = (e) => {
      callBack(e.detail.value, e.detail.previousValue)
    }

    // execute the consumer callback function immediately without having to wait for an update
    callBack(this.value, null)

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
