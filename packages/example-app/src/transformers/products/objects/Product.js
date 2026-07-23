/**
 * A product with options.
 * @param id
 * @param name
 * @param options
 */
export class Product {
  id;
  name;
  options = [];
  price;

  constructor(id, name, options = [], price = 0) {
    this.id = id;
    this.name = name;
    this.options = options;
    this.price = price;
  }

  /**
   * Check if a product contains an option.
   * @param option
   */
  hasOption(option) {
    return this.options.map(option => option.id).includes(option.id);
  }

  hasOptions(options) {
    return options.every(option => this.hasOption(option));
  }
}
