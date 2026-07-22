import { Signal } from "../../packages/signals/index.js";

export class ProductOptions extends Signal {
  constructor(productsAPI$) {
    super([]);
    this.productsAPI$ = productsAPI$;
  }

  async fetchOptions() {
    const json = await this.productsAPI$.fetchProductOptions();
    this.setValue(json);
  }
}
