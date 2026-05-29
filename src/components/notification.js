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
    this.message = "Please select a product ...";
  }

  static get properties() {
    return {
      message: { type: String },
      counter: { type: Number },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.subscriptionSelectedProduct = this.state$.observe((data) => {
      if (
        !data.customer.selectedProduct.hasOptions(data.customer.selectedOptions)
      ) {
        this.message =
          "The selected product does not contain the selected options. Please select a different product!";
      } else {
        this.message = "Valid product selected";
      }
    });

    this.subscriptionClock = this.clock$.observe((data) => {
      this.counter = data.counter;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscriptionSelectedProduct.unsubscribe();
    this.subscriptionClock.unsubscribe();
  }

  render() {
    return html`<div>${this.message} (${this.counter})</div>`;
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
