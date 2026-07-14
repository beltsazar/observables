import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "./lib/signals/index.js";
import { Products } from "./signals/Products.js";
import { ProductOptions } from "./signals/ProductOptions.js";
import { SelectedProduct } from "./signals/SelectedProduct.js";
import { ProductFilter } from "./signals/ProductFilter.js";
import { FilteredProducts } from "./signals/computed/FilteredProducts.js";
import { ProductsAPI } from "./services/ProductsAPI.js";
import { SelectedProductComponent } from "./components/selected-product.js";
import { SelectorComponent } from "./components/selector.js";
import { ProductsComponent } from "./components/products.js";
import { SelectionNotificationComponent } from "./components/selection-notification.js";

export class FeatureComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();

    // signals
    const productsAPI$ = new ProductsAPI();
    const products$ = new Products(productsAPI$);
    const productOptions$ = new ProductOptions(productsAPI$);
    const selectedProduct$ = new SelectedProduct(products$);
    const productFilter$ = new ProductFilter();

    // computed signals
    const filteredProducts$$ = this.registerComputed(
      new FilteredProducts(products$, productFilter$),
    );

    // provide shared signals to child components
    this.provideSignals({
      products$,
      productOptions$,
      selectedProduct$,
      productFilter$,
      productsAPI$,
      filteredProducts$$,
    });

    // share signals on element
    this.products$ = products$;
    this.productOptions$ = productOptions$;
  }

  static get properties() {
    return {
      heading: { type: String },
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
