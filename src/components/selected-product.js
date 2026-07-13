import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "../lib/signals/index.js";

export class SelectedProductComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
  }

  static get properties() {
    return {
      product: { type: Object, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const { selectedProduct$ } = this.consumeSignals();
    this.mapStateToSignals({ product: selectedProduct$ });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  // eslint-disable-next-line class-methods-use-this
  showProduct(product) {
    return html`
      <h3>${product.name}</h3>
      <ul>
        ${product.options.map((option) => html`<li>${option.name}</li>`)}
        <li>Price: &euro; ${product.price}</li>
      </ul>
    `;
  }

  render() {
    return html`<h2>Selection</h2>
      ${
        this.product
          ? html`${this.showProduct(this.product)}`
          : "No product selected yet"
      } `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid #000;
        padding: 16px;
      }

      h2,
      h3 {
        margin: 0 0 4px 0;
        padding: 0;
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
