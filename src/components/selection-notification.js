import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "../lib/signals";

export class SelectionNotificationComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
  }

  static get properties() {
    return {
      productSelectionMessage: { type: String, state: true },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { selectedProduct$, filteredProducts$$ } =
      await this.consumeSignals();
    this.watch(
      [selectedProduct$, filteredProducts$$],
      ([{ value: selectedProduct }, { value: filteredProducts$$ }]) => {
        if (
          selectedProduct &&
          filteredProducts$$
            .map((product) => product.id)
            .includes(selectedProduct.id)
        ) {
          this.productSelectionMessage = "Valid product selected!";
        } else if (selectedProduct) {
          this.productSelectionMessage =
            "The selected product does not match the filter. Please select a different product!";
        } else {
          this.productSelectionMessage = "Please select a product!";
        }
      },
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html` <div>${this.productSelectionMessage}</div>`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      div {
        display: inline-block;
        border: 1px solid #000;
        padding: 16px;
        margin-bottom: 16px;
      }

      ul,
      ul li {
        margin: 0;
        padding: 0;
        text-indent: 0;
        list-style-type: none;
      }
    `;
  }
}
