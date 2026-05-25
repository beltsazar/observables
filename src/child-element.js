import { html, LitElement } from 'lit'
import { ContextConsumer } from '@lit/context'
import { context } from './context.js'

export class ChildElement extends LitElement {
  contextConsumer = new ContextConsumer(this, { context })

  static get properties () {
    return {
      /**
       * The number of times the button has been clicked.
       */
      count: { type: Number },
    }
  }

  connectedCallback () {
    super.connectedCallback()
    this.state$ = this.contextConsumer.value.state$

    this.subscription = this.state$.observe((data) => {
        this.count = data.clock.counter
      }
    )
  }

  render () {
    return html`<h3>Consumer data: <code>${this.count}</code></h3>`
  }
}

customElements.define('child-element', ChildElement)