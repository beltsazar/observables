import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextProviderMixin } from "./lib/context/context-mixins.js";
import { context } from "./context.js";
import { model } from "./state/model.js";
import { Product } from "./state/objects/Product.js";
import { Status } from "./services/Status.js";
import { SelectedProductComponent } from "./components/selected-product.js";
import { SelectorComponent } from "./components/selector.js";
import { ProductsComponent } from "./components/products.js";
import { SelectionNotificationComponent } from "./components/selection-notification.js";
import { Signal, ComputedSignal, Watcher } from "./lib/signals";
import { ProductService } from "./services/ProductService.js";

export class FeatureComponent extends ContextProviderMixin(
  ScopedElementsMixin(LitElement),
) {
  state$ = new Signal(model);
  status$ = new Status();
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

  productService = new ProductService();

  constructor() {
    super();
    this.createContext(context, {
      state$: this.state$,
      status$: this.status$,
      actions: this.actions,
      selectedProduct$$: this.selectedProduct$$,
      selectedOptions$$: this.selectedOptions$$,
      products$$: this.products$$,
    });
    this.count = 0;
  }

  static get properties() {
    return {
      title: { type: String },
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
    this.watcher = new Watcher([this.state$], ([{ value }]) => {
      console.log("state$", value);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.watcher.unwatch();
  }

  async _onLoadProducts() {
    this.status$.startApiCall();
    const products = await this.productService.loadProductsFromAPI();
    this.status$.completeApiCall();

    this.state$.setValue((data) => {
      products.map((product) => {
        data.products.push(
          new Product(product.id, product.name, [
            data.options[Math.floor(Math.random() * data.options.length)],
          ]),
        );
      });
    });
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
            <div>
              <button @click="${() => this._onLoadProducts()}">
                Load products
              </button>
            </div>
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
