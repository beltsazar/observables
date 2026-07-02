import { ComputedSignal } from "../../lib/signals/index.js";

export class FilteredProducts extends ComputedSignal {
  constructor(products$, productFilter$) {
    super(
      [products$, productFilter$],
      ([{ value: products }, { value: productFilter }]) => {
        return products.filterByOptions(productFilter.options);
      },
    );
  }
}
