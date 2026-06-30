import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "../lib/signals";
import { LoadingNotificationComponent } from "./loading-notification.js";

export class ProductsComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.products = [];
  }

  static get properties() {
    return {
      products: { type: Array, state: true },
    };
  }

  static get scopedElements() {
    return {
      "loading-notification-component": LoadingNotificationComponent,
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { filteredProducts$$, selectedProduct$, productsAPI$ } =
      await this.consumeSignals();
    this.selectedProduct$ = selectedProduct$;
    this.productsAPI$ = productsAPI$;
    this.mapStateToSignals({ products: filteredProducts$$ });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleProductSelection(e, product) {
    this.selectedProduct$.setValue(product);
    e.preventDefault();
  }

  async handleLoadProducts() {
    await this.productsAPI$.fetchProducts();
  }

  render() {
    return html`<h2>Products</h2>
      <ul>
        ${this.products.map(
          (product) =>
            html`<li>
              <a
                href="#"
                @click="${(e) => this.handleProductSelection(e, product)}"
                >${product.name}</a
              >
            </li>`,
        )}
      </ul>

      <loading-notification-component></loading-notification-component>
      <button @click="${() => this.handleLoadProducts()}">
        Load products
      </button> `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid #000;
        padding: 0 16px 16px 16px;
        min-width: 500px;
      }

      ul,
      li {
        margin: 0;
        padding: 0;
        text-indent: 0;
        list-style-type: none;
      }

      a {
        border-radius: 6px;
        margin-bottom: 12px;
        display: block;
        padding: 8px 12px;
        border: 1px solid grey;
      }

      a:hover {
        border: 1px solid red;
        background-color: #eee;
      }
    `;
  }
}
