import { ReactiveData } from "../lib/ReactiveData.js";

export class Clock extends ReactiveData {
  constructor(startCount = 0) {
    super({
      counter: startCount,
    });
    setInterval(() => this.act((data) => data.counter++), 1000);
  }

  get counter() {
    return this.data.counter;
  }

  reset() {
    this.act((data) => (data.counter = 0));
  }
}
