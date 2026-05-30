import { LitElement, css, html } from "lit";
import { ContextProvider } from "@lit/context";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ObservableData } from "./lib/ObservableData.js";
import { context } from "./context.js";
import { actions, model } from "./state";
import { Clock } from "./services/Clock.js";
import { Product } from "./state/objects/Product.js";
import { SelectedProductComponent } from "./components/selected-product.js";
import { SelectorComponent } from "./components/selector.js";
import { ProductsComponent } from "./components/products.js";
import { NotificationComponent } from "./components/notification.js";

export class FeatureComponent extends ScopedElementsMixin(LitElement) {
  state$ = new ObservableData(model);

  constructor() {
    super();
    new ContextProvider(this, {
      context,
      initialValue: { state$: this.state$, clock$: new Clock() },
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
      "notification-component": NotificationComponent,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.subscription = this.state$.observe((data) => {
      console.log("data", data);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
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
          </div>
          <div class="column">
            <div>
              <button @click="${() => this._onClick()}">Add product</button>
            </div>
            <products-component></products-component>
          </div>
        </div>
        <div class="row">
          <div class="notification">
            <notification-component></notification-component>
          </div>
        </div>
      </div>
    `;
  }

  _onClick() {
    this.state$.action((data) => {
      const id = data.products.length + 1;
      const randomOption =
        data.options[Math.floor(Math.random() * data.options.length)];
      data.products.push(new Product(id, `Product ${id}`, [randomOption]));
    }, actions.ADD_PRODUCT);
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
