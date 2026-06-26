import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalConsumerMixin, Watcher } from "../lib/signals";

export class SelectionNotificationComponent extends SignalConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
  }

  static get properties() {
    return {
      productSelectionMessage: { type: String },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { selectedProduct$$, selectedOptions$$ } = await this.signalsAsync;
    this.watcher = new Watcher(
      [selectedProduct$$, selectedOptions$$],
      ([{ value: selectedProduct }, { value: selectedOptions }]) => {
        if (selectedProduct && !selectedProduct.hasOptions(selectedOptions))
          this.productSelectionMessage =
            "The selected product does not contain the selected options. Please select a different product!";
        else if (selectedProduct) {
          this.productSelectionMessage = "Valid product selected!";
        } else {
          this.productSelectionMessage = "Please select a product!";
        }
      },
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watcher.unwatch();
  }

  render() {
    return html` <div>${this.productSelectionMessage}</div>`;
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
