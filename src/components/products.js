import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsConsumerMixin } from "../lib/signals/index.js";
import { ApiNotificationsComponent } from "./api-notifications.js";

export class ProductsComponent extends SignalsConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.products = [];
    this.selectedProduct = {};
    this.saveProductStatus = {};
    this.fetchProductsStatus = {};
  }

  static get properties() {
    return {
      products: { type: Array, state: true },
      selectedProduct: { type: Object, state: true },
      saveProductStatus: { type: Object, state: true },
      fetchProductsStatus: { type: Object, state: true },
    };
  }

  static get scopedElements() {
    return {
      "api-notifications-component": ApiNotificationsComponent,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const { filteredProducts$$, selectedProduct$, products$, productsAPI$ } =
      this.sharedSignals;
    this.selectedProduct$ = selectedProduct$;
    this.products$ = products$;
    this.mapStateToSignals({
      products: filteredProducts$$,
      selectedProduct: selectedProduct$,
      saveProductStatus: this.computed(
        productsAPI$,
        ({ value }) => value.saveProduct,
      ),
      fetchProductsStatus: this.computed(
        productsAPI$,
        ({ value }) => value.fetchProducts,
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

  async saveSelectedProduct() {
    await this.selectedProduct$.saveSelectedProduct();
  }

  render() {
    return html`<h2>Products</h2>
      <ul>
        ${this.products.map(
          (product) =>
            html`<li>
              <a
                class="${classMap({ selected: product?.id === this.selectedProduct?.id })}"
                href="#"
                @click="${(e) => this.handleProductSelection(e, product)}"
                >${product.name}</a
              >
            </li>`,
        )}
      </ul>

      <api-notifications-component
        api-name="productsAPI$"
        endpoint="fetchProducts"
      >
        <div slot="pending">Loading products ...</div>
        <div slot="error">
          Products could not be loaded ... Please try again later.
        </div>
      </api-notifications-component>

      <api-notifications-component
        api-name="productsAPI$"
        endpoint="saveProduct"
      >
        <div slot="pending">Saving selected product ...</div>
        <div slot="error">Something went wrong. Please try again later.</div>
        <div slot="success">Saved successfully!</div>
      </api-notifications-component>

      <button
        ?disabled=${this.fetchProductsStatus.isPending || this.saveProductStatus.isPending}
        @click="${() => this.handleLoadProducts()}"
      >
        More products ...
      </button>
      <button
        ?disabled=${this.saveProductStatus.isPending || this.fetchProductsStatus.isPending}
        @click="${() => this.saveSelectedProduct()}"
      >
        Save selected product
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

      a:hover,
      .selected {
        border: 1px solid red;
        background-color: #eee;
      }

      .message {
        border: 2px solid black;
        padding: 16px;
        margin-bottom: 16px;
      }

      .save-loading {
        border: 2px solid black;
      }

      .products-error,
      .save-error {
        border: 2px solid red;
        padding: 16px;
        margin-bottom: 16px;
      }

      .save-successful {
        border: 2px solid green;
        padding: 16px;
        margin-bottom: 16px;
      }
    `;
  }
}
