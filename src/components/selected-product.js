import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumerMixin } from "../lib/context/context-mixins.js";
import { context } from "../context.js";
import { Watcher } from "../lib/signals/Watcher.js";

export class SelectedProductComponent extends ContextConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  context = context;

  constructor() {
    super();
    this.selectedProduct = null;
  }

  static get properties() {
    return {
      selectedProduct: { type: Object },
    };
  }

  async connectedCallback() {
    await super.connectedCallback();
    this.watcher = new Watcher([this.selectedProduct$$], ([{ value }]) => {
      this.selectedProduct = value;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watcher.unwatch();
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
