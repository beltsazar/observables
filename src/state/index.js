import { Option } from "./objects/Option.js";
import { Product } from "./objects/Product.js";
import { ProductList } from "./objects/ProductList.js";

const options = [
  new Option(1, "Option 1", 100),
  new Option(2, "Option 2", 200),
  new Option(3, "Option 3", 300),
];

export const getState = () => ({
  customer: {
    selectedProduct: null,
    selectedOptions: [],
  },
  options,
    products: new ProductList(
    new Product(1, "Product 1", [options[0], options[1], options[2]]),
    new Product(2, "Product 2", [options[1], options[2]]),
    new Product(3, "Product 3", [options[0]]),
    new Product(4, "Product 4", [options[1], options[2]]),
    new Product(5, "Product 5", [options[0], options[2]]),
  ),
  clock:{
    counter: 0,
  }
});


