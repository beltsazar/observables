import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { spy } from "sinon";
import { cloneDeep } from "lodash-es";
import { model } from "../state/model.js";
import { ReactiveData, isEqual } from "./ReactiveData.js";

describe("ObservableData", () => {
  let observable$;
  let event;
  let callBackSpy;
  let observerWrapper;

  beforeEach(() => {
    observable$ = new ReactiveData(cloneDeep(model));

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
    expect(observable$ instanceof ReactiveData).to.equal(true);
  });

  it("should change a simple property", () => {
    observable$.react(observerWrapper.observer);

    observable$.act((data) => {
      data.clock.counter = 100;
    });
    expect(event.data.clock.counter).to.equal(100);
    expect(event.previousData.clock.counter).to.equal(0);
    expect(
      observable$.isChanged(
        event.data.clock.counter,
        event.previousData.clock.counter,
      ),
    ).to.equal(true);
    expect(observable$.data.clock.counter).to.equal(100);
  });

  it("should clone objects matching original properties", () => {
    observable$.react(observerWrapper.observer);

    observable$.act((data) => {});
    expect(event.data.products === event.previousData.products).not.to.equal(
      true,
    );
    expect(event.data.products).to.deep.equal(event.previousData.products);
  });

  it("should respect deep nested child objects changes", () => {
    observable$.react(observerWrapper.observer);
    expect(observable$.data.options[1].price.amount).to.equal(200);
    expect(observable$.data.products[0].options[1].price.amount).to.equal(200);

    observable$.act((data) => {
      data.options[1].price.amount = 20;
    });
    expect(event.data.products === event.previousData.products).not.to.equal(
      true,
    );
    expect(event.data.products).not.to.deep.equal(event.previousData.products);
    expect(
      observable$.isChanged(event.data.products, event.previousData.products),
    ).to.equal(true);
    expect(
      observable$.isChanged(
        event.data.products[0],
        event.previousData.products[0],
      ),
    ).to.equal(true);
    expect(
      observable$.isChanged(
        event.data.products[2],
        event.previousData.products[2],
      ),
    ).to.equal(false);

    expect(observable$.data.options[1].price.amount).to.equal(20);
    expect(observable$.data.products[0].options[1].price.amount).to.equal(20);
  });

  it("should be able to unsubscribe", () => {
    const subscription1 = observable$.react(observerWrapper.observer);
    const subscription2 = observable$.react(observerWrapper.observer);

    expect(callBackSpy.callCount).to.equal(0);

    observable$.act(() => {});
    expect(callBackSpy.callCount).to.equal(2);

    subscription1.unsubscribe();
    observable$.act(() => {});
    expect(callBackSpy.callCount).to.equal(3);

    subscription2.unsubscribe();
    observable$.act(() => {});
    expect(callBackSpy.callCount).to.equal(3);
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
    observable$.react(observerWrapper.observer);
    observable$.act(() => {});
    expect(
      observable$.data.products[0].hasOption(observable$.data.options[1]),
    ).to.equal(true);
  });
});
