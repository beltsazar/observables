import { Signal } from "../lib/signals/index.js";

const status = {
  isLoading: false,
  isCompleted: false,
  isError: false,
  isSuccess: false,
};

const endPoints = {
  fetchProducts: { ...status },
};

export class ProductsAPI extends Signal {
  constructor() {
    super(endPoints);
  }

  async fetchProducts() {
    this.setValue((collection) => {
      collection.fetchProducts = { ...status, isLoading: true };
    });

    const response = await fetch("/api/products");
    const json = await response.json();

    this.setValue((collection) => {
      collection.fetchProducts = {
        ...status,
        isCompleted: true,
        isSuccess: true,
      };
    });

    return json;
  }
}
