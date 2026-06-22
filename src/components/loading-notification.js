import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumerMixin } from "../lib/context-mixins.js";
import { context } from "../context.js";

export class LoadingNotificationComponent extends ContextConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  status$;

  constructor() {
    super();
    this.productLoadingMessage = "Products loading";
  }

  static get properties() {
    return {
      productLoadingMessage: { type: String },
      loadingProgress: { type: Number },
      isLoading: { type: Boolean },
    };
  }

  async connectedCallback() {
    await super.connectedCallback();
    this.statusSubscription = this.status$.observe((data) => {
      this.isLoading = data.isLoading;
      this.loadingProgress = data.loadingProgress;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.statusSubscription.unsubscribe();
  }

  render() {
    return html`
      ${this.isLoading
        ? html` <div>
            ${this.productLoadingMessage} ${this.loadingProgress}
          </div>`
        : ""}
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
