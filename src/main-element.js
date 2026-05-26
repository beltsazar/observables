import { LitElement, css, html } from "lit";
import { ContextProvider } from "@lit/context";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { stateContext } from "./stateContext.js";
import { State } from "./state/index.js";
import { ObservableData, isEqual } from "./lib/observableData.js";
import { Product } from "./state/objects/Product.js";
import { ClockComponent } from "./components/clock.js";

export class MainElement extends ScopedElementsMixin(LitElement) {
  state$ = new ObservableData(new State());

  constructor() {
    super();
    new ContextProvider(this, {
      context: stateContext,
      initialValue: { state$: this.state$ },
    });
    this.count = 0;
  }

  static get properties() {
    return {
      /**
       * The number of times the button has been clicked.
       */
      count: { type: Number },
    };
  }

  static get scopedElements() {
    return {
      // "selector-component": SelectorComponent,
      // "products-component": ProductsComponent,
      // "selected-product-component": SelectedProductComponent,
      // "notification-component": NotificationComponent,
      "clock-component": ClockComponent,
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.subscription = this.state$.observe(
      (data) => {
        this.count = data.clock.counter;
      },
      (data, previousData) =>
        !isEqual(data.clock.counter, previousData.clock.counter),
    );

    this.subscription = this.state$.observe(
      (data) => {
        this.count = data.clock.counter;
      },
      (data) => data.clock.counter === 5,
    );

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
      <h1>Product selector</h1>
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
            <products-component></products-component>
          </div>
        </div>
        <div class="row">
          <div class="notification">
            <notification-component></notification-component>
          </div>
        </div>
        <div>
          <button @click="${() => this._onClick()}">Add product</button>
        </div>
        <clock-component></clock-component>
      </div>
    `;
  }

  _onClick() {
    this.state$.next((data) => {
      data.clock.counter++;
      data.products.push(new Product(20, "New Product", [data.options[1]]));
      data.version = `step${data.clock.counter}`;
    });
  }

  static get styles() {
    return css`
      :host {
        --text: #6b6375;
        --bg: #fff;
        --border: #e5e4e7;

        font-family: system-ui, "Segoe UI", Roboto, sans-serif;
        width: 1126px;
        max-width: 100%;
        margin: 0 auto;
        text-align: center;
        border-inline: 1px solid var(--border);
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        color: var(--text);
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

window.customElements.define("main-element", MainElement);
