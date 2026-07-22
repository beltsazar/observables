import { Signal } from "../../packages/signals/index.js";

export class ProductFilter extends Signal {
  constructor() {
    super({
      options: [],
      productName: "",
    });
  }

  setSelectedOptions(selectedOptions = []) {
    this.setValue(value => {
      value.options = selectedOptions;
    });
  }

  setProductName(productName) {
    this.setValue(value => {
      value.productName = productName;
    });
  }
}
