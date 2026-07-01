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
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    const { productFilter$, productOptions$ } = await this.consumeSignals();
    this.productOptions$ = productOptions$;
    this.productFilter$ = productFilter$;
    this.mapStateToSignals({ options: productOptions$ });
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

    this.productFilter$.setValue((value) => {
      value.options = selectedOptions;
    });

    e.preventDefault();
  }

  _onClick() {
    this.shadowRoot
      ?.querySelector('[name="optionsForm"]')
      ?.dispatchEvent(new Event("submit"));
  }

  render() {
    return html`<h2>Filter products</h2>
      <div class="select-options">
        <form
          name="optionsForm"
          @submit=${(e) => {
            this._onSubmit(e);
          }}
        >
          <fieldset>
            <legend>Choose your product options:</legend>
            ${this.options.map(
              (option) =>
                html` <div>
                  <input
                    type="checkbox"
                    id="${option.id}"
                    name="${option.id}"
                    @click=${() => this._onClick()}
                  />
                  <label for="${option.id}">${option.name}</label>
                </div>`,
            )}
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
    `;
  }
}
