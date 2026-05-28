import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumer } from "@lit/context";
import { context } from "../context.js";

export class NotificationComponent extends ScopedElementsMixin(LitElement) {
  state$;
  clock$;

  constructor() {
    super();
    new ContextConsumer(this, {
      context,
      callback: ({ state$, clock$ }) => {
        this.state$ = state$;
        this.clock$ = clock$;
      },
    });
    this.message = "";
  }

  static get properties() {
    return {
      message: { type: String },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.subscriptionSelectedProduct = this.state$.observe(
      (data) => {
        if (
          !data.customer.selectedProduct.hasOptions(
            data.customer.selectedOptions,
          )
        ) {
          this.message =
            "The selected product does not contain the selected options. Please select a different product!";
        } else {
          this.message = "Valid product selected";
        }
      },
      (data) => data.customer.selectedProduct,
    );

    this.subscriptionClock = this.clock$.observe(
      (data) => {
        this.message = "Please select a product :)";
      },
      (data) => data.counter > 5 && !this.state$.data.customer.selectedProduct,
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscriptionSelectedProduct.unsubscribe();
    this.subscriptionClock.unsubscribe();
  }

  render() {
    return html`${this.message.length > 0
      ? html`<div>${this.message}</div>`
      : ""} `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      div {
        border: 1px solid #000;
        padding: 16px;
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
