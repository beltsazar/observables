import { ObservableData } from "../lib/ObservableData.js";

export const createRandomProducts = () => {
  const products = [];

  for (let i = 0; i < 3; i++) {
    const id = Math.floor(Math.random() * 100);
    products.push({
      id,
      name: `Product ${id}`,
    });
  }
  return products;
};

export class ProductService extends ObservableData {
  constructor() {
    super({
      status: {
        isLoading: false,
      },
      products: [],
    });
  }

  async _getProductsFromAPI() {
    let resolver;
    const deferredPromise = new Promise((resolve) => {
      resolver = resolve;
    });
    setTimeout(() => {
      resolver(createRandomProducts());
    }, 5000);
    return deferredPromise;
  }

  loadProducts() {
    this.update((data) => (data.status.isLoading = true));
    this._getProductsFromAPI().then((products) => {
      this.update((data) => {
        data.status.isLoading = false;
        data.products = products;
      });
    });
  }
}
