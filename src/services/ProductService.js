export class ProductService {
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

  async loadProductsFromAPI() {
    let resolver;
    const deferredPromise = new Promise((resolve) => {
      resolver = resolve;
    });
    setTimeout(() => {
      resolver(this._createRandomProducts());
    }, 5000);
    return deferredPromise;
  }
}
