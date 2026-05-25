import { LitElement, css, html } from 'lit'
import {ContextProvider} from '@lit/context';
import { context} from './context.js'
import { State } from './state/index.js'
import { ObservableData, isEqual } from './lib/observableData.js'
import { Product } from './state/objects/Product.js'
import './child-element.js';

export class MainElement extends LitElement {
  contextProvider = new ContextProvider(this, {context});
  state$ = new ObservableData(new State())

  static get properties () {
    return {
      /**
       * The number of times the button has been clicked.
       */
      count: { type: Number },
    }
  }

  constructor () {
    super()
    this.contextProvider.setValue({ state$: this.state$ });
    this.count = 0
  }

  connectedCallback () {
    super.connectedCallback()

    this.subscription = this.state$.observe((data) => {
        this.count = data.clock.counter
      }, (data, previousData) => !isEqual(data.clock.counter, previousData.clock.counter)
    )

    this.subscription = this.state$.observe((data) => {
        this.count = data.clock.counter
      }, data => data.clock.counter === 5
    )

    this.subscription = this.state$.observe((data) => {
        console.log('data', data)
      },
    )

    this.state$.data.products = ''
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.subscription.unsubscribe()
  }

  render () {
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
            <child-element></child-element>
        </section>
    `
  }

  _onClick () {
    this.state$.next(data => {
      data.clock.counter++
      data.products.push(new Product(20, 'New Product', [data.options[1]]))
      data.version = `step${data.clock.counter}`
    })
  }

  static get styles () {
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

window.customElements.define('main-element', MainElement)
