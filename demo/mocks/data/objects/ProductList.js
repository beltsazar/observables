export class ProductList extends Array {
  /**
   * Check if a product contains all options from the options.
   * @param options
   */
  filterByOptions(options) {
    return this.filter((product) => product.hasOptions(options));
  }
}
