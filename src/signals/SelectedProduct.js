import { Signal } from "../lib/signals/index.js";

export class SelectedProduct extends Signal {
  constructor() {
    super();
  }

  setSelectedProduct(product) {
    this.setValue(product);
  }
}
