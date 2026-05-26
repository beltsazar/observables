import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { spy } from "sinon";
import { cloneDeep } from "lodash-es";
import { State } from "../state/index.js";
import { ObservableData, isEqual } from "./observableData.js";

describe("ObservableData", () => {
  let observable$;
  let event;
  let callBackSpy;
  let observerWrapper;

  beforeEach(() => {
    observable$ = new ObservableData(cloneDeep(new State()));

    event = {};
    observerWrapper = {
      observer: (data, previousData) => {
        event = {
          data,
          previousData,
        };
      },
    };
    callBackSpy = spy(observerWrapper, "observer");
  });

  afterEach(() => {
    callBackSpy.restore();
  });

  it("should correctly instantiate an observable data object", () => {
    expect(observable$ instanceof ObservableData).to.equal(true);
  });

  it("should register observer and call it immediately with initial data", () => {
    observable$.observe(observerWrapper.observer);
    expect(event.data).to.deep.equal(cloneDeep(new State()));
    expect(event.previousData).to.deep.equal(null);
    expect(callBackSpy.calledOnce).to.equal(true);

    observable$.next(() => {});
    expect(callBackSpy.calledTwice).to.equal(true);
  });

  it("should change a simple property", () => {
    observable$.observe(observerWrapper.observer);

    observable$.next((data) => {
      data.clock.counter = 100;
    });
    expect(event.data.clock.counter).to.equal(100);
    expect(event.previousData.clock.counter).to.equal(0);
    expect(
      isEqual(event.data.clock.counter, event.previousData.clock.counter),
    ).to.equal(false);
    expect(observable$.data.clock.counter).to.equal(100);
  });

  it("should clone objects matching original properties", () => {
    observable$.observe(observerWrapper.observer);

    observable$.next((data) => {});
    expect(event.data.products === event.previousData.products).not.to.equal(
      true,
    );
    expect(event.data.products).to.deep.equal(event.previousData.products);
  });

  it("should respect deep nested child objects changes", () => {
    observable$.observe(observerWrapper.observer);
    expect(observable$.data.options[1].price.amount).to.equal(200);
    expect(observable$.data.products[0].options[1].price.amount).to.equal(200);

    observable$.next((data) => {
      data.options[1].price.amount = 20;
    });
    expect(event.data.products === event.previousData.products).not.to.equal(
      true,
    );
    expect(event.data.products).not.to.deep.equal(event.previousData.products);
    expect(isEqual(event.data.products, event.previousData.products)).to.equal(
      false,
    );
    expect(
      isEqual(event.data.products[0], event.previousData.products[0]),
    ).to.equal(false);
    expect(
      isEqual(event.data.products[2], event.previousData.products[2]),
    ).to.equal(true);

    expect(observable$.data.options[1].price.amount).to.equal(20);
    expect(observable$.data.products[0].options[1].price.amount).to.equal(20);
  });

  it("should call observer conditionally", () => {
    observable$.observe(
      observerWrapper.observer,
      (data) => data.clock.counter === 5,
    );
    expect(callBackSpy.callCount).to.equal(1);

    observable$.next((data) => {
      data.clock.counter = 100;
    });
    expect(callBackSpy.callCount).to.equal(1);

    observable$.next((data) => {
      data.clock.counter = 5;
    });
    expect(callBackSpy.callCount).to.equal(2);
  });

  it("should be able to unsubscribe", () => {
    const subscription1 = observable$.observe(observerWrapper.observer);
    const subscription2 = observable$.observe(observerWrapper.observer);

    expect(callBackSpy.callCount).to.equal(2);

    observable$.next(() => {});
    expect(callBackSpy.callCount).to.equal(4);

    subscription1.unsubscribe();
    observable$.next(() => {});
    expect(callBackSpy.callCount).to.equal(5);

    subscription2.unsubscribe();
    observable$.next(() => {});
    expect(callBackSpy.callCount).to.equal(5);
  });

  it("should be immutable!!!", () => {
    expect(() => {
      observable$.data.options[1].price.amount = 20;
    }).to.throw(Error);
    expect(() => {
      observable$.data.products[0] = {};
    }).to.throw(Error);
  });

  it("should call an object method", () => {
    observable$.observe(observerWrapper.observer);
    observable$.next(() => {});
    expect(
      observable$.data.products[0].hasOption(observable$.data.options[1]),
    ).to.equal(true);
  });
});
