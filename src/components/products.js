import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumerMixin } from "../context.js";
import { LoadingNotificationComponent } from "./loading-notification.js";

export class ProductsComponent extends ContextConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  state$;

  constructor() {
    super();
    this.mapContext(({ state$ }) => {
      this.state$ = state$;
    });
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

  connectedCallback() {
    super.connectedCallback();
    this.products = [...this.state$.data.products];
    this.subscription = this.state$.observe((data) => {
      this.updateProducts(data);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  updateProducts(data) {
    this.products = [
      ...data.products.filterByOptions(data.customer.selectedOptions),
    ];
  }

  handleProductSelection(e, product) {
    this.state$.update((data) => (data.customer.selectedProduct = product));
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
