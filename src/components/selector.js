import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumerMixin } from "../lib/context-mixins.js";
import { context } from "../context.js";

export class SelectorComponent extends ContextConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  context = context;

  constructor() {
    super();
    this.products = [];
  }

  async connectedCallback() {
    await super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  _onSubmit(e) {
    // Set selected customer options based on checked checkboxes
    const selectedOptions = this.state$.data.options.filter((option) => {
      const form = e.target;
      const input = form ? form.elements.namedItem(String(option.id)) : null;
      return Boolean(input?.checked);
    });

    this.actions.selectOptions(selectedOptions);

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
            ${this.state$.data.options.map(
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
