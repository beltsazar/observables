import { LitElement, css, html } from "lit";
import { ContextConsumer } from "@lit/context";
import { context } from "../context.js";

export class ClockComponent extends LitElement {
  clock$;

  constructor() {
    super();
    new ContextConsumer(this, {
      context: context,
      callback: ({ clock$ }) => (this.clock$ = clock$),
    });
    this.counter = 0;
  }

  static get properties() {
    return {
      counter: { type: Number },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.subscription = this.clock$.observe((data) => {
      this.counter = data.counter;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  _onClick() {
    this.clock$.reset();
  }

  render() {
    return html`<button @click="${() => this._onClick()}">
      <div>${this.counter}</div>
    </button> `;
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      button {
        display: inline-block;
        min-width: 40px;
        text-align: center;
        border: 1px solid #000;
        border-radius: 6px;
        padding: 2px;
      }
    `;
  }
}
