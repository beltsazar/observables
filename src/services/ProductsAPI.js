import { Signal } from "../lib/signals/index.js";

const model = {
  isLoading: false,
  isCompleted: false,
  isError: false,
  isSuccess: false,
  json: null,
};

export class ProductsAPI extends Signal {
  constructor() {
    super(model);
  }

  async fetchProducts() {
    this.setValue({ ...model, isLoading: true });

    const response = await fetch("/api/products");
    const json = await response.json();

    this.setValue({
      ...model,
      isCompleted: true,
      isSuccess: true,
      json,
    });

    return json;
  }
}
