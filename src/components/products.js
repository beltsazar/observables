import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "../lib/signals/index.js";
import { LoadingNotificationComponent } from "./loading-notification.js";

export class ProductsComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.products = [];
    this.fetchProducts = {};
  }

  static get properties() {
    return {
      products: { type: Array, state: true },
      fetchProducts: { type: Object, state: true },
      isLoading: { type: Boolean, state: true },
      isError: { type: Boolean, state: true },
    };
  }

  static get scopedElements() {
    return {
      "loading-notification-component": LoadingNotificationComponent,
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { filteredProducts$$, selectedProduct$, products$, productsAPI$ } =
      await this.consumeSignals();
    this.selectedProduct$ = selectedProduct$;
    this.products$ = products$;
    this.mapStateToSignals({
      products: filteredProducts$$,
      productsApiStatus: productsAPI$,
      fetchProducts: this.computed(
        productsAPI$,
        ({ value }) => value.fetchProducts,
      ),
      isLoading: this.computed(
        productsAPI$,
        ({ value }) => value.fetchProducts?.isLoading,
      ),
      isError: this.computed(
        productsAPI$,
        ({ value }) => value.fetchProducts?.isError,
      ),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  handleProductSelection(e, product) {
    this.selectedProduct$.setSelectedProduct(product);
    e.preventDefault();
  }

  async handleLoadProducts() {
    await this.products$.fetchProducts();
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

      ${
        this.fetchProducts.isError
          ? html`<div class="error-message">
              Something went wrong. Please try again later.
            </div>`
          : ""
      }

      <button
        ?disabled=${this.fetchProducts.isLoading}
        @click="${() => this.handleLoadProducts()}"
      >
        More products ...
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

      .error-message {
        border: 2px solid red;
        padding: 16px;
        margin-bottom: 16px;
      }
    `;
  }
}
