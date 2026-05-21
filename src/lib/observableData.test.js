import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { spy } from 'sinon'
import { cloneDeep } from 'lodash-es'
import { getState } from '../state/index.js'
import { ObservableData } from './observableData.js'

describe('getPathsToDeepObject', () => {
  let observable$
  let eventData
  let callBackSpy
  let callBackWrapper

  beforeEach(() => {
    observable$ = new ObservableData(cloneDeep(getState()))

    eventData = {}
    callBackWrapper = {
      callBack: (e) => {
        eventData = e
      }
    }
    callBackSpy = spy(callBackWrapper, 'callBack')
  })

  afterEach(() => {
    callBackSpy.restore()
  })

  it('should correctly instantiate an observable data object', () => {
    expect(observable$ instanceof ObservableData).to.equal(true)
  })

  it('should observe changes to a specific property of an object', () => {
    observable$.watch(observable$.data.clock, 'counter', callBackWrapper.callBack)
    expect(eventData).to.deep.equal({})

    observable$.update(observable$.data.clock, 'counter', 1)
    expect(callBackSpy.calledOnce).to.equal(true)
    expect(eventData.data).to.equal(1)
    expect(eventData.oldValue).to.equal(0)
    expect(eventData.target).to.equal(observable$.data.clock)
    expect(eventData.property).to.equal('counter')
  })

  it('should observe any nested changes from the root object', () => {
    observable$.watch(observable$.data, callBackWrapper.callBack)

    observable$.update(observable$.data.clock, 'counter', 1)
    expect(callBackSpy.calledOnce).to.equal(true)
    expect(eventData.data).to.equal(1)
    expect(eventData.oldValue).to.equal(0)
    expect(eventData.target).to.equal(observable$.data.clock)
    expect(eventData.property).to.equal('counter')
  })

  it('should observe deep nested child objects changes', () => {
    observable$.watch(observable$.data.products[0], callBackWrapper.callBack)

    observable$.update(observable$.data.options[1].price, 'amount', 20)
    expect(callBackSpy.calledOnce).to.equal(true)
    expect(eventData.data).to.equal(20)
    expect(eventData.oldValue).to.equal(200)
    expect(eventData.target).to.equal(observable$.data.options[1].price)
    expect(eventData.property).to.equal('amount')
  })

  it('should NOT observe changes in objects that are not children', () => {
    observable$.watch(observable$.data.products[2], callBackWrapper.callBack)

    observable$.update(observable$.data.options[1].price, 'amount', 20)
    expect(eventData).to.deep.equal({})
  })

  it('should be able to unsubscribe', () => {
    const subscription1 = observable$.watch(observable$.data.clock, 'counter', callBackWrapper.callBack)
    const subscription2 = observable$.watch(observable$.data.clock, 'counter', callBackWrapper.callBack)

    observable$.update(observable$.data.clock, 'counter', 1)
    expect(callBackSpy.callCount).to.equal(2)

    subscription1.unwatch()
    observable$.update(observable$.data.clock, 'counter', 2)
    expect(callBackSpy.callCount).to.equal(3)

    subscription2.unwatch()
    observable$.update(observable$.data.clock, 'counter', 3)
    expect(callBackSpy.callCount).to.equal(3)
  })

  it('objects references should persist through version clones', () => {
    observable$.watch(observable$.data.clock, 'counter', callBackWrapper.callBack)
    expect(eventData).to.deep.equal({})

    observable$.update(observable$.data.clock, 'counter', 1)
    expect(callBackSpy.calledOnce).to.equal(true)
    expect(eventData.data).to.equal(1)
    expect(eventData.oldValue).to.equal(0)
    expect(eventData.target).to.equal(observable$.data.clock)
    expect(eventData.property).to.equal('counter')

    observable$.update(observable$.data.clock, 'counter', 2)
    expect(callBackSpy.calledTwice).to.equal(true)
    expect(eventData.data).to.equal(2)
    expect(eventData.oldValue).to.equal(1)
    expect(eventData.target).to.equal(observable$.data.clock)
    expect(eventData.property).to.equal('counter')
  })
})

