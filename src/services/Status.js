import { Observable } from "../lib/Observable.js";

const model = {
  isLoading: false,
  isError: false,
  isCompleted: false,
  loadingProgress: 0,
};

export class Status extends Observable {
  constructor() {
    super(model);
  }

  startApiCall() {
    this.setValue((data) => {
      data.isLoading = true;
      data.isError = false;
      data.isCompleted = false;
      data.loadingProgress = 0;
    });
    this.progressTimer = setInterval(
      () => this.setValue((data) => data.loadingProgress++),
      1000,
    );
  }

  completeApiCall() {
    this.setValue((data) => {
      data.isLoading = false;
      data.isError = false;
      data.isCompleted = true;
      data.loadingProgress = 0;
    });
    clearInterval(this.progressTimer);
  }
}
