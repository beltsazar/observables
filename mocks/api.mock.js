import { defineMock } from "vite-plugin-mock-dev-server";

export default defineMock({
  url: "/api/products",
  body: [{ id: 1, name: "Product 2", options: [] }],
});
