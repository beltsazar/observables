import { Signal } from "../lib/signals/index.js";

const model = {
  isLoading: false,
  isCompleted: false,
  isError: false,
  isSuccess: false,
  jsonResponse: null,
};

export class ProductService extends Signal {
  constructor() {
    super(model);
  }

  _createRandomProducts() {
    const products = [];

    for (let i = 0; i < 3; i++) {
      const id = Math.floor(Math.random() * 100);
      products.push({
        id,
        name: `Product ${id}`,
      });
    }
    return products;
  }

  fetchFromAPI() {
    let resolver;
    const deferredPromise = new Promise((resolve) => {
      resolver = resolve;
    });
    setTimeout(() => {
      resolver(this._createRandomProducts());
    }, 2000);
    return deferredPromise;
  }

  loadProductsFromAPI() {
    this.setValue({ ...model, isLoading: true });
    this.fetchFromAPI().then((jsonResponse) => {
      this.setValue({
        ...model,
        isCompleted: true,
        isSuccess: true,
        jsonResponse,
      });
    });
  }
}
