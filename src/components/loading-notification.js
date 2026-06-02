import { LitElement, css, html } from "lit";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { ContextConsumer } from "@lit/context";
import { context } from "../context.js";
import { Timer } from "../services/Timer.js";

export class LoadingNotificationComponent extends ScopedElementsMixin(
  LitElement,
) {
  state$;
  timer$ = new Timer(0);

  constructor() {
    super();
    new ContextConsumer(this, {
      context,
      callback: ({ state$ }) => {
        this.state$ = state$;
      },
    });
    this.productLoadingMessage = "Products loading";
    this.loadingProgress = "";
  }

  static get properties() {
    return {
      productLoadingMessage: { type: String },
      loadingProgress: { type: String },
      isLoading: { type: Boolean },
    };
  }

  connectedCallback() {
    super.connectedCallback();

    this.timerSubscription = this.timer$.observe((data) => {
      this.loadingProgress += "#";
    });

    this.statusSubscription = this.state$.observe((data, previousData) => {
      const {
        status: { isLoading },
      } = data;
      if (isLoading && isLoading !== previousData?.status.isLoading) {
        this.timer$.reset();
        this.loadingProgress = "";
      }
      this.isLoading = isLoading;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.timerSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }

  render() {
    return html`
      ${this.isLoading
        ? html` <div>
            ${this.productLoadingMessage} ${this.loadingProgress}
          </div>`
        : ""}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      div {
        display: inline-block;
        border: 1px solid #000;
        padding: 16px;
        margin-bottom: 16px;
      }

      ul,
      ul li {
        margin: 0;
        padding: 0;
        text-indent: 0;
        list-style-type: none;
      }
    `;
  }
}
