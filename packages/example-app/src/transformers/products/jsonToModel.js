import { Product } from "./objects/Product.js";
import { Option } from "./objects/Option.js";
import { ProductList } from "./objects/ProductList.js";

export function jsonToModel(productsJson = []) {
  const products = new ProductList(...productsJson);
  products.forEach((product, index) => {
    const options = product.options.map(
      option => new Option(option.id, option.name),
    );
    products[index] = new Product(
      product.id,
      product.name,
      options,
      product.price,
    );
  });

  return products;
}
