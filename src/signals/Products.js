import { Signal } from "../lib/signals/index.js";

export class Products extends Signal {
  constructor() {
    super([]);
  }

  filteredProductsByOptions(filterOptions) {
    function productHasOption(product, filterOption) {
      return product.options
        .map((option) => option.id)
        .includes(filterOption.id);
    }

    function productHasAllOptions(product) {
      return filterOptions.every((filterOption) =>
        productHasOption(product, filterOption),
      );
    }

    return this.value.filter((product) => productHasAllOptions(product));
  }
}
