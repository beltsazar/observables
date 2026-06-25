import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumerMixin } from "../lib/context/context-mixins.js";
import { context } from "../context.js";
import { LoadingNotificationComponent } from "./loading-notification.js";
import { Watcher } from "../lib/signals/Watcher.js";

export class ProductsComponent extends ContextConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  context = context;

  constructor() {
    super();
    this.products = [];
  }

  static get properties() {
    return {
      products: { type: Array },
    };
  }

  static get scopedElements() {
    return {
      "loading-notification-component": LoadingNotificationComponent,
    };
  }

  async connectedCallback() {
    await super.connectedCallback();

    this.products = [...this.state$.value.products];
    this.watcher = new Watcher(
      [this.products$$, this.selectedOptions$$],
      ([{ value: products }, { value: selectedOptions }]) => {
        this.updateProducts(products, selectedOptions);
      },
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watcher.unwatch();
  }

  updateProducts(products, selectedOptions) {
    this.products = [...products.filterByOptions(selectedOptions)];
  }

  handleProductSelection(e, product) {
    this.state$.setValue((value) => (value.customer.selectedProduct = product));
    e.preventDefault();
  }

  render() {
    return html`<h2>Products</h2>
      <loading-notification-component></loading-notification-component>
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
      </ul> `;
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
