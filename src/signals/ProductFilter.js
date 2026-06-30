import { Signal } from "../lib/signals";

export class ProductFilter extends Signal {
  constructor() {
    super({
      options: [],
    });
  }
}
