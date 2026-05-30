import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumer } from "@lit/context";
import { context } from "../context.js";

export class SelectedProductComponent extends ScopedElementsMixin(LitElement) {
  state$;

  constructor() {
    super();
    new ContextConsumer(this, {
      context,
      callback: ({ state$ }) => (this.state$ = state$),
    });
    this.selectedProduct = null;
  }

  static get properties() {
    return {
      selectedProduct: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.subscription = this.state$.observe((data) => {
      console.log("luister ik ...");
      this.selectedProduct = data.customer.selectedProduct;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  showProduct(product) {
    return html`
      <h3>${product.name}</h3>
      <ul>
        ${product.options.map((option) => html`<li>${option.name}</li>`)}
      </ul>
    `;
  }

  render() {
    return html`<h2>Selection</h2>
      ${this.selectedProduct
        ? html`${this.showProduct(this.selectedProduct)}`
        : "No product selected yet"} `;
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
