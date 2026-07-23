import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsProviderMixin } from "../../signals/index.js";
import { createSharedSignals } from "./signals/index.js";
import { SelectedProductComponent } from "./components/selected-product.js";
import { SelectorComponent } from "./components/selector.js";
import { ProductsComponent } from "./components/products.js";
import { SelectionNotificationComponent } from "./components/selection-notification.js";

export class FeatureComponent extends SignalsProviderMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.sharedSignals = createSharedSignals();

    // use shared signals in this element
    const { products$, productOptions$ } = this.sharedSignals;
    this.products$ = products$;
    this.productOptions$ = productOptions$;

    // local signal only in this element
    const counter$ = this.signal(0);
    setInterval(() => {
      counter$.setValue(counter$.value + 1);
    }, 1000);
    this.mapStateToSignals({
      counter: counter$,
    });
  }

  static get properties() {
    return {
      heading: { type: String },
      counter: { type: Number, state: true },
    };
  }

  static get scopedElements() {
    return {
      "selector-component": SelectorComponent,
      "products-component": ProductsComponent,
      "selected-product-component": SelectedProductComponent,
      "selection-notification-component": SelectionNotificationComponent,
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    await Promise.all([
      this.products$.fetchProducts(),
      this.productOptions$.fetchOptions(),
    ]);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <h1>${this.heading}</h1>
      <div class="container">
        <div class="row">
          <div class="column">
            <div class="selector">
              <selector-component></selector-component>
            </div>
            <div class="selected-product">
              <selected-product-component></selected-product-component>
            </div>
            <div class="notification">
              <selection-notification-component></selection-notification-component>
            </div>
          </div>
          <div class="column">
            <products-component></products-component>
          </div>
        </div>
        ${this.counter}
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        --text: #000;
        --bg: #fff;
        --border: #e5e4e7;

        font-family: system-ui, "Segoe UI", Roboto, sans-serif;
        max-width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        color: var(--text);
        padding: 0 16px;
      }

      .container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .row {
        display: flex;
        flex-direction: row;
        gap: 16px;
      }

      .column {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    `;
  }
}

window.customElements.define("feature-component", FeatureComponent);
