import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalConsumerMixin } from "../lib/signals/mixins.js";
import { Watcher } from "../lib/signals/Watcher.js";

export class LoadingNotificationComponent extends SignalConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.productLoadingMessage = "Products loading";
  }

  static get properties() {
    return {
      productLoadingMessage: { type: String },
      isLoading: { type: Boolean },
    };
  }

  async connectedCallback() {
    await super.connectedCallback();
    this.watcher = new Watcher([this.productService$], ([{ value }]) => {
      this.isLoading = value.isLoading;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watcher.unwatch();
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
