import { LitElement, css, html } from 'lit';
import { getState } from './state/index.js';
import { Observable } from './lib/observable.js';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class MyElement extends LitElement {
  static get properties() {
    return {
      /**
       * The number of times the button has been clicked.
       */
      count: { type: Number },
    }
  }

  constructor() {
    super()
    this.count = 0
  }

  connectedCallback() {
    super.connectedCallback();
    const state$ = new Observable(getState());
    this.state$ = state$;

    // console.log(this.state$.data);

    state$.watch(state$.data.products[0], (e) => {
      console.log('products[0]', e);
    })

    state$.watch(state$.data.products[2], (e) => {
      console.log('products[2]', e);
    })

    state$.watch(state$.data, (e) => {
      console.log('data', state$._data);
      console.log('iets veranderd', e);
    })

    state$.watch(state$.data.options[0].price, 'amount', (e) => {
      console.log('prijs veranderd', e);
    })

    state$.watch(state$.data.clock, 'counter', (e) => {
      console.log('klok tikt', e.value);
      this.count = e.value;
    })

    state$.update(state$.data.options[0].price, 'amount', 0);
    state$.update(state$.data.clock, 'counter', 0);

    state$.data.products = ''
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  render() {
    return html`
      <section id="center">
        <div>
          <p>
          <h1>Hello world!
          </p>
        </div>
        <button
          type="button"
          class="counter"
          @click=${this._onClick}
          part="button"
        >
          Count is ${this.count}
        </button>
      </section>
    `
  }

  _onClick() {
    this.state$.update(this.state$.data.clock, 'counter', this.state$.data.clock.counter + 1);
    //this.count++
  }

  static get styles() {
    return css`
        :host {
            --text: #6b6375;
            --bg: #fff;
            --border: #e5e4e7;
            
            font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
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

        h1 {
            font-size: 56px;
            letter-spacing: -1.68px;
            margin: 32px 0;
        }

        p {
            margin: 0;
        }
    `
  }
}

window.customElements.define('my-element', MyElement)
