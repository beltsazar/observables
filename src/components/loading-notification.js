import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "../lib/signals/index.js";

export class LoadingNotificationComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.productLoadingMessage = "Products loading";
  }

  static get properties() {
    return {
      productLoadingMessage: { type: String, state: true },
      isLoading: { type: Boolean, state: true },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { productsAPI$ } = await this.consumeSignals();
    this.mapStateToSignals({
      isLoading: this.computed(
        productsAPI$,
        ({ value }) => value.fetchProducts?.isLoading,
      ),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      ${this.isLoading ? html` <div>${this.productLoadingMessage}</div>` : ""}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      div {
        display: inline-block;
        border: 1px solid #000;
        padding: 16px;
        margin-bottom: 16px;
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
