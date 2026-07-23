import { expect, describe, it } from "vitest";
import { Signal } from "../Signal.js";
import { ComputedSignal } from "../ComputedSignal.js";

describe("ComputedSignal", () => {
  it("should correctly instantiate ComputedSignal object", () => {
    const computedSignal$$ = new ComputedSignal(new Signal(0), () => {});
    expect(computedSignal$$ instanceof ComputedSignal).to.equal(true);
    computedSignal$$.dispose();
  });

  it("should compute from a single signal", () => {
    const signal$ = new Signal(1);
    const computedSignal$$ = new ComputedSignal(
      signal$,
      signal => signal.value + 1,
    );
    expect(computedSignal$$.value).to.equal(2);

    signal$.setValue(2);
    expect(computedSignal$$.value).to.equal(3);

    computedSignal$$.dispose();
  });

  it("should compute from multiple signals", () => {
    const signal1$ = new Signal(10);
    const signal2$ = new Signal(20);
    const computedSignal$$ = new ComputedSignal(
      [signal1$, signal2$],
      ([{ value: value1 }, { value: value2 }]) => value1 + value2,
    );
    expect(computedSignal$$.value).to.equal(30);

    signal1$.setValue(20);
    expect(computedSignal$$.value).to.equal(40);

    signal2$.setValue(40);
    expect(computedSignal$$.value).to.equal(60);

    signal1$.setValue(50);
    signal2$.setValue(50);
    expect(computedSignal$$.value).to.equal(100);
  });

  it("should be read only", () => {
    const computedSignal$$ = new ComputedSignal(new Signal(0), () => {});

    expect(() => {
      computedSignal$$.value = 20;
    }).to.throw(Error);
    expect(() => {
      computedSignal$$.setValue(20);
    }).to.throw(Error);

    computedSignal$$.dispose();
  });
});
