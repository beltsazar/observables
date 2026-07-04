export class ProductList extends Array {
  /**
   * Check if a product contains all options from the options.
   * @param options
   */
  filterByOptions(options) {
    return this.filter((product) => product.hasOptions(options));
  }

  filterByProductName(productName) {
    return this.filter((product) =>
      product.name.toUpperCase().includes(productName.toUpperCase()),
    );
  }
}
