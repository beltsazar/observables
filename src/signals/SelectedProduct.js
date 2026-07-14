import { Signal } from "../lib/signals/index.js";

export class SelectedProduct extends Signal {
  constructor(products$) {
    super(null);
    this.products$ = products$;
  }

  setSelectedProduct(product) {
    this.setValue(product);
  }

  async saveSelectedProduct() {
    await this.products$.saveSelectedProduct(this.value);
  }
}
