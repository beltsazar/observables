import { ObservableData } from "../lib/observableData.js";

export class Clock extends ObservableData {
  constructor(startCount = 0) {
    super({
      counter: startCount,
    });
    setInterval(() => this.next((data) => data.counter++), 1000);
  }

  get counter() {
    return this.data.counter;
  }

  reset() {
    this.next((data) => (data.counter = 0));
  }
}
