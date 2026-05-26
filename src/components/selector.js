import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumer } from "@lit/context";
import { stateContext } from "../stateContext.js";

export class SelectorComponent extends ScopedElementsMixin(LitElement) {
  state$;

  constructor() {
    super();
    new ContextConsumer(this, {
      context: stateContext,
      callback: ({ state$ }) => (this.state$ = state$),
    });
    this.products = [];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  _onSubmit(e) {
    // Set selected customer options based on checked checkboxes
    this.state$.next((data) => {
      data.customer.selectedOptions = data.options.filter((option) => {
        const form = e.target;
        const input = form ? form.elements.namedItem(String(option.id)) : null;
        return Boolean(input?.checked);
      });
      e.preventDefault();
    });
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
            ${this.state$.data.options.map(
              (option) =>
                html`<div>
                  <input
                    type="checkbox"
                    id="${option.id}"
                    name="${option.id}"
                    @click=${() => {
                      this.shadowRoot
                        ?.querySelector('[name="optionsForm"]')
                        ?.dispatchEvent(new Event("submit"));
                    }}
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
