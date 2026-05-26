import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumer } from "@lit/context";
import { context } from "../context.js";

export class NotificationComponent extends ScopedElementsMixin(LitElement) {
  state$;

  constructor() {
    super();
    new ContextConsumer(this, {
      context: context,
      callback: ({ state$ }) => (this.state$ = state$),
    });
    this.message = "Please select a product :)";
  }

  static get properties() {
    return {
      message: { type: String },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    // Watch customer changes
    this.subscription = this.state$.observe((data) => {
      if (data.customer.selectedProduct) {
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
      } else {
        this.message = "Please select a product :)";
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  render() {
    return html` <div>${this.message}</div> `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
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
