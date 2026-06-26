import { Signal } from "../lib/signals";
import { Option } from "./objects/Option.js";
import { Product } from "./objects/Product.js";
import { ProductList } from "./objects/ProductList.js";

const prices = {
  cheap: {
    amount: 100,
  },
  moderate: {
    amount: 200,
  },
  expensive: {
    amount: 300,
  },
};

const options = [
  new Option(1, "Option 1", prices.cheap),
  new Option(2, "Option 2", prices.moderate),
  new Option(3, "Option 3", prices.expensive),
];

const model = {
  customer: {
    name: "Daniel",
    selectedProduct: null,
    selectedOptions: [],
  },
  options: options,
  products: new ProductList(
    new Product(1, "Product 1", [options[0], options[1], options[2]]),
    new Product(2, "Product 2", [options[1], options[2]]),
    new Product(3, "Product 3", [options[0]]),
    new Product(4, "Product 4", [options[1], options[2]]),
    new Product(5, "Product 5", [options[0], options[2]]),
  ),
};

export class State extends Signal {
  constructor(value = model) {
    super(value);
  }

  addProducts(productsJson) {
    this.setValue((state) => {
      productsJson.map((product) => {
        state.products.push(
          new Product(product.id, product.name, [
            state.options[Math.floor(Math.random() * state.options.length)],
          ]),
        );
      });
    });
  }
}
