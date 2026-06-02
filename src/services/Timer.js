import { ObservableData } from "../lib/ObservableData.js";

export class Timer extends ObservableData {
  startCount;

  constructor(startCount = 0) {
    super({
      count: startCount,
    });
    this.startCount = startCount;
    setInterval(() => this.update((data) => data.count++), 1000);
  }

  get count() {
    return this.data.count;
  }

  reset() {
    this.update((data) => (data.count = this.startCount));
  }
}
