import { Product } from "./Product.js";
import { Option } from "./Option.js";

export class ProductList extends Array {
  /**
   * Check if a product contains all options from the options.
   * @param options
   */
  filterByOptions(options) {
    return this.filter((product) => product.hasOptions(options));
  }
}
