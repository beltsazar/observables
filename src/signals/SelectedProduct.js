import { Signal } from "../lib/signals/index.js";

export class SelectedProduct extends Signal {
  constructor(productsAPI$) {
    super(null);
    this.productsAPI$ = productsAPI$;
  }

  setSelectedProduct(product) {
    this.setValue(product);
  }

  async saveSelectedProduct() {
    await this.productsAPI$.saveSelectedProduct(this.value);
  }
}
