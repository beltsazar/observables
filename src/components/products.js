import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumer } from "@lit/context";
import { context } from "../context.js";
import { ClockComponent } from "./clock.js";

export class ProductsComponent extends ScopedElementsMixin(LitElement) {
  state$;

  constructor() {
    super();
    new ContextConsumer(this, {
      context,
      callback: ({ state$ }) => (this.state$ = state$),
    });
    this.products = [];
  }

  static get scopedElements() {
    return {
      "clock-component": ClockComponent,
    };
  }

  static get properties() {
    return {
      products: { type: Array },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.products = [...this.state$.data.products];
    this.subscription = this.state$.react((data) => {
      this.products = [
        ...data.products.filterByOptions(data.customer.selectedOptions),
      ];
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  handleProductSelection(e, product) {
    this.state$.act((data) => (data.customer.selectedProduct = product));
    e.preventDefault();
  }

  render() {
    return html`<h2>Products<clock-component></clock-component></h2>
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
      </ul>`;
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
        margin: 8px;
        display: block;
        padding: 8px 24px;
        border: 1px solid grey;
      }

      a:hover {
        border: 1px solid red;
        background-color: #eee;
      }

      clock-component {
        font-weight: normal;
        font-size: 16px;
        float: right;
        margin-right: 8px;
      }
    `;
  }
}
