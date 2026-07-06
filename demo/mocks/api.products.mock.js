import { defineMock } from "vite-plugin-mock-dev-server";
import { products, options } from "./data/products.js";

export default defineMock([
  {
    url: "/api/products",
    body: products,
    delay: 2000,
    error: {
      probability: 0.5, // 30% chance of returning error
      status: 503,
      statusText: "Service Unavailable",
    },
  },
  {
    url: "/api/products/selectedProduct",
    body: { success: true },
    delay: 1000,
    error: {
      probability: 0.5, // 30% chance of returning error
      status: 503,
      statusText: "Service Unavailable",
    },
  },
  {
    url: "/api/products/options",
    body: options,
    delay: 1000,
  },
]);
