import { Signal } from "../lib/signals/index.js";

export class ProductFilter extends Signal {
  constructor() {
    super({
      options: [],
    });
  }
}
