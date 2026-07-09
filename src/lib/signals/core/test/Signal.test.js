import { expect, describe, it } from "vitest";
import { Signal } from "../Signal.js";

const nested = {
  customer: {
    name: "Customer",
  },
};

describe("Signal", () => {
  it("should correctly instantiate a Signal object", () => {
    expect(new Signal() instanceof Signal).to.equal(true);
  });

  it("should change a simple value", () => {
    const signal$ = new Signal(0);
    expect(signal$.value).to.equal(0);
    signal$.setValue(1);
    expect(signal$.value).to.equal(1);
    expect(signal$.previousValue).to.equal(0);
  });

  it("should clone objects matching original properties", () => {
    const signal$ = new Signal(nested);
    expect(signal$.value === nested).to.equal(false);
    expect(signal$.value).to.deep.equal(nested);
    expect(signal$.value.customer.name).to.deep.equal("Customer");
    signal$.setValue((value) => {
      value.customer.name = "Another Customer";
    });
    expect(signal$.value.customer.name).to.equal("Another Customer");
    expect(signal$.previousValue).to.deep.equal(nested);
  });

  it("should only notify when the new value is not equal to the previous one", () => {
    const signal$ = new Signal(nested);
    const oldValue = signal$.value;
    signal$.setValue(nested);
    expect(signal$.value === oldValue).to.equal(true);

    signal$.setValue((value) => {
      value.customer.name = "Another Customer";
    });
    expect(signal$.value === oldValue).to.not.equal(true);
  });

  it("should be immutable!!!", () => {
    const signal$ = new Signal(0);
    const signalWithNestedObject$ = new Signal(nested);
    expect(() => {
      signal$.value = 20;
    }).to.throw(Error);
    expect(() => {
      signalWithNestedObject$.customer.name = "Another Customer";
    }).to.throw(Error);
  });
});
