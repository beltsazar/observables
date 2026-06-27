import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalProviderMixin } from "./lib/signals/mixins.js";
import { State } from "./state/State.js";
import { SelectedProductComponent } from "./components/selected-product.js";
import { SelectorComponent } from "./components/selector.js";
import { ProductsComponent } from "./components/products.js";
import { SelectionNotificationComponent } from "./components/selection-notification.js";
import { ComputedSignal, Watcher } from "./lib/signals";
import { ProductService } from "./services/ProductService.js";

export class FeatureComponent extends SignalProviderMixin(
  ScopedElementsMixin(LitElement),
) {
  state$ = new State();
  selectedProduct$$ = new ComputedSignal(
    [this.state$],
    ([{ value }]) => value.customer.selectedProduct,
  );
  selectedOptions$$ = new ComputedSignal(
    [this.state$],
    ([{ value }]) => value.customer.selectedOptions,
  );
  products$$ = new ComputedSignal(
    [this.state$],
    ([{ value }]) => value.products,
  );
  productService$ = new ProductService();

  constructor() {
    super();
    this.provideSignals({
      state$: this.state$,
      productService$: this.productService$,
      selectedProduct$$: this.selectedProduct$$,
      selectedOptions$$: this.selectedOptions$$,
      products$$: this.products$$,
    });
  }

  static get properties() {
    return {
      title: { type: String, state: true },
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

  connectedCallback() {
    super.connectedCallback();
    this.watch([this.state$], ([{ value }]) => {
      console.debug("state$", value);
    });
    this.watch([this.productService$], ([{ value }]) => {
      if (value.isCompleted && value.isSuccess && value.jsonResponse) {
        this.state$.addProducts(value.jsonResponse);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <h1>${this.title}</h1>
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
