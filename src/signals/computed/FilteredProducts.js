import { ComputedSignal } from "../../../packages/signals/index.js";

export class FilteredProducts extends ComputedSignal {
  constructor(products$, productFilter$) {
    super(
      [products$, productFilter$],
      ([{ value: products }, { value: productFilter }]) =>
        products
          .filterByOptions(productFilter.options)
          .filterByProductName(productFilter.productName),
    );
  }
}
