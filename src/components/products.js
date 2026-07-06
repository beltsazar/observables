import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ComputedSignal, SignalsMixin } from "../lib/signals/index.js";
import { LoadingNotificationComponent } from "./loading-notification.js";
import { ApiNotificationsComponent } from "./api-notifications.js";

export class ProductsComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.products = [];
    this.saveSelectedProductsStatus = {};
    this.fetchProductsStatus = {};
  }

  static get properties() {
    return {
      products: { type: Array, state: true },
      isPendingShown: { type: Boolean, state: true },
      isSuccessShown: { type: Boolean, state: true },
      isErrorShown: { type: Boolean, state: true },
      isFetchProductsErrorShown: { type: Boolean, state: true },
      saveSelectedProductsStatus: { type: Object, state: true },
      fetchProductsStatus: { type: Object, state: true },
    };
  }

  static get scopedElements() {
    return {
      "loading-notification-component": LoadingNotificationComponent,
      "api-notifications-component": ApiNotificationsComponent,
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { filteredProducts$$, selectedProduct$, products$, productsAPI$ } =
      await this.consumeSignals();
    this.selectedProduct$ = selectedProduct$;
    this.products$ = products$;

    const saveSelectedProductsStatus$ = this.registerComputed(
      new ComputedSignal(
        productsAPI$,
        ({ value }) => value.saveSelectedProduct,
      ),
    );
    this.watch(
      saveSelectedProductsStatus$,
      ({ value: { isCompleted, isSuccess, isError, isPending } }) => {
        if (isCompleted && isSuccess) {
          this.isSuccessShown = true;
          clearTimeout(this.isSaveSuccessfulShownTimeout);
          this.isSaveSuccessfulShownTimeout = setTimeout(() => {
            this.isSuccessShown = false;
          }, 3000);
        } else {
          this.isSuccessShown = false;
        }

        if (isCompleted && isError) {
          this.isErrorShown = true;
          clearTimeout(this.isSaveErrorShownTimeout);
          this.isSaveErrorShownTimeout = setTimeout(() => {
            this.isErrorShown = false;
          }, 3000);
        } else {
          this.isErrorShown = false;
        }

        this.isPendingShown = isPending;
      },
    );

    const fetchProductsStatus$ = this.registerComputed(
      new ComputedSignal(productsAPI$, ({ value }) => value.fetchProducts),
    );
    this.watch(fetchProductsStatus$, ({ value: { isCompleted, isError } }) => {
      if (isCompleted && isError) {
        this.isFetchProductsErrorShown = true;
        clearTimeout(this.isFetchProductsErrorShownTimeout);
        this.isFetchProductsErrorShownTimeout = setTimeout(() => {
          this.isFetchProductsErrorShown = false;
        }, 3000);
      } else {
        this.isFetchProductsErrorShown = false;
      }
    });

    this.mapStateToSignals({
      products: filteredProducts$$,
      productsApiStatus: productsAPI$,
      saveSelectedProductsStatus: saveSelectedProductsStatus$,
      fetchProductsStatus: fetchProductsStatus$,
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
                href="#"
                @click="${(e) => this.handleProductSelection(e, product)}"
                >${product.name}</a
              >
            </li>`,
        )}
      </ul>

      <!--      <loading-notification-component></loading-notification-component>-->

      <api-notifications-component
        api-name="productsAPI$"
        endpoint="fetchProducts"
      >
        <div slot="pending">Loading products ...</div>
        <div slot="error">
          Products could not be loaded ... please try later
        </div>
      </api-notifications-component>

      <api-notifications-component
        api-name="productsAPI$"
        endpoint="saveSelectedProduct"
      >
        <div slot="pending">Saving selected product ...</div>
        <div slot="error">Something went wrong. Please try again later.</div>
        <div slot="success">Saved successfully!</div>
      </api-notifications-component>

      <button
        ?disabled=${this.fetchProductsStatus.isPending}
        @click="${() => this.handleLoadProducts()}"
      >
        More products ...
      </button>
      <button
        ?disabled=${this.saveSelectedProductsStatus.isPending}
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

      a:hover {
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
