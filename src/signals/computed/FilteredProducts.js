import { ComputedSignal } from "../../lib/signals/index.js";

export class FilteredProducts extends ComputedSignal {
  constructor(products$, productFilter$) {
    super(
      [products$, productFilter$],
      ([{ value: products }, { value: productFilter }]) =>
        getProductsFilteredByOptions(products, productFilter.options),
    );
  }
}

function productHasOption(product, filterOption) {
  return product.options.map((option) => option.id).includes(filterOption.id);
}

function productHasAllOptions(product, filterOptions) {
  return filterOptions.every((filterOption) =>
    productHasOption(product, filterOption),
  );
}

function getProductsFilteredByOptions(products, filterOptions) {
  return products.filter((product) =>
    productHasAllOptions(product, filterOptions),
  );
}
