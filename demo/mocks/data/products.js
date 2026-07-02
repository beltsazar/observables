import { Option } from "./objects/Option.js";
import { Product } from "./objects/Product.js";
import { ProductList } from "./objects/ProductList.js";

export const options = [
  new Option(1, "Versatile"),
  new Option(2, "Quality"),
  new Option(3, "Budget"),
];

export const products = new ProductList(
  new Product(1, "Paper", [options[0], options[1], options[2]], 10),
  new Product(2, "Pen", [options[1], options[2]], 150),
  new Product(3, "Ink", [options[0]], 50),
  new Product(4, "Book", [options[1], options[2]], 100),
  new Product(5, "Paperback", [options[0], options[2]], 50),
);
