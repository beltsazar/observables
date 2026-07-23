import { Products } from "./Products.js";
import { ProductOptions } from "./ProductOptions.js";
import { SelectedProduct } from "./SelectedProduct.js";
import { ProductFilter } from "./ProductFilter.js";
import { FilteredProducts } from "./computed/FilteredProducts.js";
import { ProductsAPI } from "./services/ProductsAPI.js";

export function createSharedSignals() {
  const productsAPI$ = new ProductsAPI();
  const products$ = new Products(productsAPI$);
  const productOptions$ = new ProductOptions(productsAPI$);
  const selectedProduct$ = new SelectedProduct(products$);
  const productFilter$ = new ProductFilter();
  const filteredProducts$$ = new FilteredProducts(products$, productFilter$);

  return {
    products$,
    productOptions$,
    selectedProduct$,
    productFilter$,
    productsAPI$,
    filteredProducts$$,
  };
}
