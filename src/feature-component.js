import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "./lib/signals";
import { State } from "./state/State.js";
import { Products } from "./signals/Products.js";
import { ProductOptions } from "./signals/ProductOptions.js";
import { SelectedProduct } from "./signals/SelectedProduct.js";
import { ProductFilter } from "./signals/ProductFilter.js";
import { SelectedProductComponent } from "./components/selected-product.js";
import { SelectorComponent } from "./components/selector.js";
import { ProductsComponent } from "./components/products.js";
import { SelectionNotificationComponent } from "./components/selection-notification.js";
import { ProductsAPI } from "./services/ProductsAPI.js";

export class FeatureComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
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

  async connectedCallback() {
    super.connectedCallback();

    // setup shared signals
    this.state$ = new State();

    this.products$ = new Products();
    this.productOptions$ = new ProductOptions();
    this.selectedProduct$ = new SelectedProduct();
    this.productFilter$ = new ProductFilter();

    this.filteredProducts$$ = this.computed(
      [this.products$, this.productFilter$],
      ([products, { value: productFilter }]) => {
        return products.filteredProductsByOptions(productFilter.options);
      },
    );

    this.selectedProduct$$ = this.computed(
      this.state$,
      ({ value }) => value.customer.selectedProduct,
    );
    this.selectedOptions$$ = this.computed(
      this.state$,
      ({ value }) => value.customer.selectedOptions,
    );
    this.products$$ = this.computed(this.state$, ({ value }) => value.products);
    this.productsAPI$ = new ProductsAPI();

    // provide shared signals to child components
    this.provideSignals({
      state$: this.state$,

      products$: this.products$,
      productOptions$: this.productOptions$,
      selectedProduct$: this.selectedProduct$,
      productFilter$: this.productFilter$,
      filteredProducts$$: this.filteredProducts$$,

      productsAPI$: this.productsAPI$,
      selectedProduct$$: this.selectedProduct$$,
      selectedOptions$$: this.selectedOptions$$,
      products$$: this.products$$,
    });

    this.watch(this.productsAPI$, ({ value: result }) => {
      if (result.isCompleted && result.isSuccess && result.json) {
        console.log(result);
        this.products$.setValue((products) => {
          result.json.products.forEach((product) => products.push(product));
        });
        this.productOptions$.setValue(result.json.options);
      }
    });

    // this.watch(this.products$, ({ value }) => {
    //   console.log('products$', value)
    // });
    // this.watch(this.selectedProduct$, ({ value }) => {
    //   console.log('selectedProduct$', value)
    // });
    // this.watch(this.productFilter$, ({ value }) => {
    //   console.log('productFilter$', value)
    // });
    this.watch(this.filteredProducts$$, ({ value }) => {
      console.log("filteredProducts$$", value);
    });

    await this.productsAPI$.fetchProducts();
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
