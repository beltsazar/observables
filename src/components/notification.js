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
  }

  static get properties() {
    return {
      message: { type: String },
      counter: { type: Number },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.counter = this.clock$.counter;
    this.selectedProductSubscription = this.state$.observe((data) => {
      const {
        customer: { selectedProduct, selectedOptions },
      } = data;

      if (selectedProduct && !selectedProduct.hasOptions(selectedOptions))
        this.message =
          "The selected product does not contain the selected options. Please select a different product!";
      else if (selectedProduct) {
        this.message = "Valid product selected";
      } else {
        this.message = "Please select a product ...";
      }
    });

    this.clockSubscription = this.clock$.observe((data) => {
      this.counter = data.counter;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.selectedProductSubscription.unsubscribe();
    this.clockSubscription.unsubscribe();
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
