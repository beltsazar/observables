import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { spy } from "sinon";
import { cloneDeep, isEqual } from "lodash-es";
import { Signal } from "../Signal.js";

const state = {};

describe("ObservableData", () => {
  let observable$;
  let event;
  let callBackSpy;
  let observerWrapper;

  beforeEach(() => {
    observable$ = new Signal(cloneDeep(state));

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
    expect(observable$ instanceof Signal).to.equal(true);
  });

  it("should register observer and call it immediately with initial data", () => {
    observable$.observe(observerWrapper.observer);
    expect(event.data).to.deep.equal(new Signal(cloneDeep(state)).value);
    expect(event.previousData).to.deep.equal(null);
    expect(callBackSpy.calledOnce).to.equal(true);

    observable$.setValue(() => {});
    expect(callBackSpy.calledTwice).to.equal(true);
  });

  it("should change a simple property", () => {
    observable$.observe(observerWrapper.observer);

    observable$.setValue((data) => {
      data.customer.name = "Daniel Marcuse";
    });
    expect(event.data.customer.name).to.equal("Daniel Marcuse");
    expect(event.previousData.customer.name).to.equal("Daniel");
    expect(
      isEqual(event.data.customer.name, event.previousData.customer.name),
    ).to.equal(false);
    expect(observable$.value.customer.name).to.equal("Daniel Marcuse");
  });

  it("should clone objects matching original properties", () => {
    observable$.observe(observerWrapper.observer);

    observable$.setValue(() => {});
    expect(event.data.products === event.previousData.products).not.to.equal(
      true,
    );
    expect(event.data.products).to.deep.equal(event.previousData.products);
  });

  it("should respect deep nested child objects changes", () => {
    observable$.observe(observerWrapper.observer);
    expect(observable$.value.options[1].price.amount).to.equal(200);
    expect(observable$.value.products[0].options[1].price.amount).to.equal(200);

    observable$.setValue((data) => {
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

    expect(observable$.value.options[1].price.amount).to.equal(20);
    expect(observable$.value.products[0].options[1].price.amount).to.equal(20);
  });

  it("should be able to unsubscribe", () => {
    const subscription1 = observable$.observe(observerWrapper.observer);
    const subscription2 = observable$.observe(observerWrapper.observer);

    expect(callBackSpy.callCount).to.equal(2);

    observable$.setValue(() => {});
    expect(callBackSpy.callCount).to.equal(4);

    subscription1.unsubscribe();
    observable$.setValue(() => {});
    expect(callBackSpy.callCount).to.equal(5);

    subscription2.unsubscribe();
    observable$.setValue(() => {});
    expect(callBackSpy.callCount).to.equal(5);
  });

  it("should be immutable!!!", () => {
    expect(() => {
      observable$.value.options[1].price.amount = 20;
    }).to.throw(Error);
    expect(() => {
      observable$.value.products[0] = {};
    }).to.throw(Error);
  });

  it("should call an object method", () => {
    observable$.observe(observerWrapper.observer);
    observable$.setValue(() => {});
    expect(
      observable$.value.products[0].hasOption(observable$.value.options[1]),
    ).to.equal(true);
  });
});
