import { html } from "lit";
import { http, delay, HttpResponse } from "msw";
import "../packages/example-feature/src/feature-component.js";

import { Option } from "../packages/example-feature/src/transformers/products/objects/Option.js";
import { Product } from "../packages/example-feature/src/transformers/products/objects/Product.js";
import { ProductList } from "../packages/example-feature/src/transformers/products/objects/ProductList.js";

const options = [
  new Option(1, "Versatile"),
  new Option(2, "Quality"),
  new Option(3, "Budget"),
];

const products = new ProductList(
  new Product(1, "Paper", [options[0], options[1], options[2]], 10),
  new Product(2, "Pen", [options[1], options[2]], 150),
  new Product(3, "Ink", [options[0]], 50),
  new Product(4, "Book", [options[1], options[2]], 100),
  new Product(5, "Paperback", [options[0], options[2]], 50),
);

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: "Examples/Full Feature",
  render: () => html`
    <feature-component heading="Product selector 1"></feature-component>
  `,
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    primary: true,
    label: "Button",
  },
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products", async () => {
          await delay(1000);
          return HttpResponse.json(products);
        }),
        http.get("/api/products/options", async () => {
          await delay();
          return HttpResponse.json(options);
        }),
        http.post("/api/products/selectedProduct", async () => {
          await delay();
          return HttpResponse.json({ success: true });
        }),
      ],
    },
  },
};
