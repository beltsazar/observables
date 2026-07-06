import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsMixin } from "../lib/signals/index.js";

export class SelectorComponent extends SignalsMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.options = [];
  }

  static get properties() {
    return {
      options: { type: Array, state: true },
      isPending: { type: Boolean, state: true },
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { productFilter$, productOptions$, productsAPI$ } =
      await this.consumeSignals();
    this.productOptions$ = productOptions$;
    this.productFilter$ = productFilter$;
    this.mapStateToSignals({
      options: productOptions$,
      isPending: this.computed(
        productsAPI$,
        ({ value }) => value.fetchProductOptions?.isPending,
      ),
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  _onSubmit(e) {
    // Set selected customer options based on checked checkboxes
    const selectedOptions = this.options.filter((option) => {
      const form = e.target;
      const input = form ? form.elements.namedItem(String(option.id)) : null;
      return Boolean(input?.checked);
    });

    this.productFilter$.setSelectedOptions(selectedOptions);
    e.preventDefault();
  }

  optionsChanged() {
    this.shadowRoot
      ?.querySelector('[name="optionsForm"]')
      ?.dispatchEvent(new Event("submit"));
  }

  productNameChanged(e) {
    const productName = e.target.value;
    this.productFilter$.setProductName(productName);
  }

  render() {
    if (this.isPending) {
      return html`<div class="loading">Loading...</div>`;
    }

    return html`<h2>Filter products</h2>
      <div class="select-options">
        <form
          name="optionsForm"
          @submit=${(e) => {
            this._onSubmit(e);
          }}
        >
          <fieldset>
            <legend>Product options:</legend>
            ${this.options.map(
              (option) =>
                html` <div>
                  <input
                    type="checkbox"
                    id="${option.id}"
                    name="${option.id}"
                    @click=${(e) => this.optionsChanged(e)}
                  />
                  <label for="${option.id}">${option.name}</label>
                </div>`,
            )}
          </fieldset>

          <fieldset>
            <legend>Product name:</legend>
            <input
              @keyup=${(e) => this.productNameChanged(e)}
              type="text"
              id="name"
              name="name"
              size="15"
            />
          </fieldset>
        </form>
      </div>`;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        border: 1px solid #000;
        padding: 0 16px 16px 16px;
      }

      fieldset {
        margin-bottom: 16px;
      }
      .loading {
        padding-top: 16px;
      }
    `;
  }
}
