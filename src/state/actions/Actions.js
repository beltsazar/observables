import { ProductService } from "../../services/ProductService.js";
import { Product } from "../objects/Product.js";

export class Actions {
  state$;
  productService;

  constructor(state$) {
    this.state$ = state$;
    this.productService = new ProductService();
  }

  async loadProducts() {
    this.state$.update((data) => (data.status.isLoading = true));

    const products = await this.productService.loadProductsFromAPI();

    this.state$.update((data) => {
      data.status.isLoading = false;
      products.map((product) => {
        data.products.push(
          new Product(product.id, product.name, [
            data.options[Math.floor(Math.random() * data.options.length)],
          ]),
        );
      });
    });
  }
}
