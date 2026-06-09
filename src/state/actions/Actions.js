import { ProductService } from "../../services/ProductService.js";
import { Product } from "../objects/Product.js";

export class Actions {
  state$;
  status$;
  productService;

  constructor(state$, status$) {
    this.state$ = state$;
    this.status$ = status$;
    this.productService = new ProductService();
  }

  async loadProducts() {
    this.status$.startApiCall();
    const products = await this.productService.loadProductsFromAPI();
    this.status$.completeApiCall();

    this.state$.update((data) => {
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
