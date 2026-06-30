import { defineMock } from "vite-plugin-mock-dev-server";
import { products, options } from "./data/products.js";

export default defineMock({
  url: "/api/products",
  body: { products, options },
  delay: 2000,
});
