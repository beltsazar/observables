import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumer } from "@lit/context";
import { context } from "../context.js";
import { Clock } from "../services/Clock.js";

export class NotificationComponent extends ScopedElementsMixin(LitElement) {
  state$;
  clock$ = new Clock(0);

  constructor() {
    super();
    new ContextConsumer(this, {
      context,
      callback: ({ state$, clock$ }) => {
        this.state$ = state$;
      },
    });
    this.productLoadingMessage = "Products loading";
    this.loadingProgress = "";
  }

  static get properties() {
    return {
      productSelectionMessage: { type: String },
      productLoadingMessage: { type: String },
      loadingProgress: { type: String },
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
        this.productSelectionMessage =
          "The selected product does not contain the selected options. Please select a different product!";
      else if (selectedProduct) {
        this.productSelectionMessage = "Valid product selected!";
      } else {
        this.productSelectionMessage = "Please select a product!";
      }
    });

    this.clockSubscription = this.clock$.observe((data) => {
      this.loadingProgress += "#";
    });

    this.productServiceSubscription = this.state$.observe(
      (data, previousData) => {
        const {
          status: { isLoading },
        } = data;
        if (isLoading && isLoading !== previousData?.status.isLoading) {
          this.loadingProgress = "";
        }
        this.isLoading = isLoading;
      },
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.selectedProductSubscription.unsubscribe();
    this.clockSubscription.unsubscribe();
    this.productServiceSubscription.unsubscribe();
  }

  render() {
    return html`
      <div>${this.productSelectionMessage}</div>
      <br />
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
