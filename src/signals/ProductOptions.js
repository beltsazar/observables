import { Signal } from "../lib/signals/index.js";

export class ProductOptions extends Signal {
  constructor(productsAPI$) {
    super([]);
    this.productsAPI$ = productsAPI$;
  }

  async fetchOptions() {
    const json = await this.productsAPI$.fetchProducts();
    const options = json.options;

    this.setValue(options);
  }
}
