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

export const options = [
  new Option(1, "Option 1", prices.cheap),
  new Option(2, "Option 2", prices.moderate),
  new Option(3, "Option 3", prices.expensive),
];

export const products = new ProductList(
  new Product(1, "Product 1", [options[0], options[1], options[2]]),
  new Product(2, "Product 2", [options[1], options[2]]),
  new Product(3, "Product 3", [options[0]]),
  new Product(4, "Product 4", [options[1], options[2]]),
  new Product(5, "Product 5", [options[0], options[2]]),
);
