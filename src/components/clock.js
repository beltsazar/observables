import { LitElement, css, html } from "lit";
import { ContextConsumer } from "@lit/context";
import { stateContext } from "../stateContext.js";

export class ClockComponent extends LitElement {
  state$;

  constructor() {
    super();
    new ContextConsumer(this, {
      context: stateContext,
      callback: ({ state$ }) => (this.state$ = state$),
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
    this.subscription = this.state$.observe((data) => {
      this.counter = data.clock.counter;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.subscription.unsubscribe();
  }

  render() {
    return html`<div>${this.counter}</div> `;
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      div {
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
