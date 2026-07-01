import { Signal } from "../lib/signals/index.js";

export class Products extends Signal {
  constructor(productsAPI$) {
    super([]);
    this.productsAPI$ = productsAPI$;
  }

  async fetchProducts() {
    const json = await this.productsAPI$.fetchProducts();
    const products = json.products;

    this.setValue((currentProducts) => {
      products.forEach((product) => currentProducts.push(product));
    });
  }
}
