import { expect, describe, it } from "vitest";
import { Signal } from "../Signal.js";
import { Watcher } from "../Watcher.js";

describe("Watcher", () => {
  it("should correctly instantiate Watcher object", () => {
    const watcher = new Watcher(new Signal(0), () => {});
    expect(watcher instanceof Watcher).to.equal(true);
    watcher.dispose();
  });

  it("should watch a single signal", () => {
    let result;
    const signal$ = new Signal(0);
    const watcher = new Watcher(signal$, signal => {
      result = signal.value;
    });
    expect(result).to.equal(0);

    signal$.setValue(1);
    expect(result).to.equal(1);

    watcher.dispose();
    signal$.setValue(1);
    expect(result).to.equal(1);
  });

  it("should change watch a multiple signals", () => {
    let result;
    const signal$ = new Signal(0);
    const signal2$ = new Signal("Cat");
    const watcher = new Watcher([signal$, signal2$], ([signal, signal2]) => {
      result = [signal, signal2];
    });

    expect(result[0].value).to.equal(0);
    expect(result[1].value).to.equal("Cat");

    signal$.setValue(1);
    expect(result[0].value).to.equal(1);
    expect(result[1].value).to.equal("Cat");

    signal2$.setValue("Dog");
    expect(result[0].value).to.equal(1);
    expect(result[1].value).to.equal("Dog");

    watcher.dispose();
  });
});
