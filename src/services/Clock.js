import { ObservableData } from "../lib/ObservableData.js";

export class Clock extends ObservableData {
  constructor(startCount = 0) {
    super({
      counter: startCount,
    });
    // setInterval(() => this.act((data) => data.counter++), 1000);
  }

  get counter() {
    return this.data.counter;
  }

  reset() {
    this.action((data) => (data.counter = 0));
  }
}
