import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { spy } from 'sinon'
import { cloneDeep } from 'lodash-es'
import { getState } from '../state/index.js'
import { Observable } from './observable.js'

describe('getPathsToDeepObject', () => {
  let observable$;
  let eventData;
  let callBackSpy;
  let callBackWrapper;

  beforeEach(() => {
    observable$ = new Observable(cloneDeep(getState()));

    eventData = {};
    callBackWrapper = {
      callBack: (e) => {
        eventData = e;
      }
    }
    callBackSpy = spy(callBackWrapper, 'callBack');
  })

  afterEach(() => {
    callBackSpy.restore();
  })

  it('should correctly instantiate an observable data object', () => {
    expect(observable$ instanceof Observable).to.equal(true)
  })

  it('should observe changes to a specific property of an object', () => {
    observable$.observe(observable$.value.clock, 'counter', callBackWrapper.callBack)
    expect(eventData).to.deep.equal({});

    observable$.next(observable$.value.clock, 'counter', 1)
    expect(callBackSpy.calledOnce).to.equal(true);
    expect(eventData.value).to.equal(1);
    expect(eventData.oldValue).to.equal(0);
    expect(eventData.target).to.equal(observable$.value.clock);
    expect(eventData.property).to.equal('counter');
  })

  it('should observe any nested changes from the root object', () => {
    observable$.observe(observable$.value, callBackWrapper.callBack)

    observable$.next(observable$.value.clock, 'counter', 1)
    expect(callBackSpy.calledOnce).to.equal(true);
    expect(eventData.value).to.equal(1);
    expect(eventData.oldValue).to.equal(0);
    expect(eventData.target).to.equal(observable$.value.clock);
    expect(eventData.property).to.equal('counter');
  })

  it('should observe deep nested child objects changes', () => {
    observable$.observe(observable$.value.products[0], callBackWrapper.callBack)

    observable$.next(observable$.value.options[1].price, 'amount', 20)
    expect(callBackSpy.calledOnce).to.equal(true);
    expect(eventData.value).to.equal(20);
    expect(eventData.oldValue).to.equal(200);
    expect(eventData.target).to.equal(observable$.value.options[1].price);
    expect(eventData.property).to.equal('amount');
  })

  it('should NOT observe changes in objects that are not children', () => {
    observable$.observe(observable$.value.products[2], callBackWrapper.callBack)

    observable$.next(observable$.value.options[1].price, 'amount', 20)
    expect(eventData).to.deep.equal({});
  })

  it('should be able to unsubscribe', () => {
    const subscription1 = observable$.observe(observable$.value.clock, 'counter', callBackWrapper.callBack)
    const subscription2 = observable$.observe(observable$.value.clock, 'counter', callBackWrapper.callBack)

    observable$.next(observable$.value.clock, 'counter', 1)
    expect(callBackSpy.callCount).to.equal(2);

    subscription1.unsubscribe();
    observable$.next(observable$.value.clock, 'counter', 2)
    expect(callBackSpy.callCount).to.equal(3);

    subscription2.unsubscribe();
    observable$.next(observable$.value.clock, 'counter', 3)
    expect(callBackSpy.callCount).to.equal(3);
  })

  it('objects references should persist through version clones', () => {
    observable$.observe(observable$.value.clock, 'counter', callBackWrapper.callBack)
    expect(eventData).to.deep.equal({});

    observable$.next(observable$.value.clock, 'counter', 1)
    expect(callBackSpy.calledOnce).to.equal(true);
    expect(eventData.value).to.equal(1);
    expect(eventData.oldValue).to.equal(0);
    expect(eventData.target).to.equal(observable$.value.clock);
    expect(eventData.property).to.equal('counter');

    observable$.next(observable$.value.clock, 'counter', 2)
    expect(callBackSpy.calledTwice).to.equal(true);
    expect(eventData.value).to.equal(2);
    expect(eventData.oldValue).to.equal(1);
    expect(eventData.target).to.equal(observable$.value.clock);
    expect(eventData.property).to.equal('counter');
  })
});

