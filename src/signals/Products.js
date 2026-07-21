import { Signal } from "../lib/signals/index.js";
import { jsonToModel } from "../transformers/products/jsonToModel.js";

export class Products extends Signal {
  constructor(productsAPI$) {
    super(jsonToModel()); // initialize with an empty array (ProductList)
    this.productsAPI$ = productsAPI$;
  }

  async fetchProducts() {
    const json = await this.productsAPI$.fetchProducts();
    if (!json) {
      console.error("Failed to fetch products");
      return;
    }
    const products = jsonToModel(json);
    this.setValue(currentProducts => {
      // append new products to the current products array :)
      products.forEach(product => currentProducts.push(product));
    });
  }

  async saveSelectedProduct(product) {
    const json = await this.productsAPI$.saveProduct(product);
    if (!json) {
      console.error("Failed to save product");
    }
  }
}
