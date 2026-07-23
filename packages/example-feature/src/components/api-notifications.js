import { LitElement, css, html } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { ScopedElementsMixin } from "@open-wc/scoped-elements/lit-element.js";
import { SignalsConsumerMixin } from "../../../signals/index.js";

export class ApiNotificationsComponent extends SignalsConsumerMixin(
  ScopedElementsMixin(LitElement),
) {
  constructor() {
    super();
    this.apiName = "";
    this.endpoint = "";
  }

  static get properties() {
    return {
      apiName: { type: String, attribute: "api-name" },
      endpoint: { type: String },
      isPendingShown: { type: Boolean, state: true },
      isSuccessShown: { type: Boolean, state: true },
      isErrorShown: { type: Boolean, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const api$ = this.sharedSignals[this.apiName];
    this.watch(
      this.computed(api$, ({ value }) => value[this.endpoint]),
      ({ value: { isCompleted, isSuccess, isError, isPending } }) => {
        clearTimeout(this.isSuccessShownTimeout);
        clearTimeout(this.isErrorShownTimeout);

        if (isCompleted && isSuccess) {
          this.isSuccessShown = true;
          this.isSuccessShownTimeout = setTimeout(() => {
            this.isSuccessShown = false;
          }, 3000);
        } else {
          this.isSuccessShown = false;
        }

        if (isCompleted && isError) {
          this.isErrorShown = true;
          this.isErrorShownTimeout = setTimeout(() => {
            this.isErrorShown = false;
          }, 3000);
        } else {
          this.isErrorShownTimeout = false;
        }

        if (isPending) {
          this.isPendingShown = true;
          this.isErrorShown = false;
          this.isSuccessShown = false;
        } else {
          this.isPendingShown = false;
        }
      },
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  firstUpdated() {
    this.isPendingContent =
      this.shadowRoot
        .querySelector('slot[name="pending"]')
        .assignedElements({ flatten: true }).length > 0;
    this.isErrorContent =
      this.shadowRoot
        .querySelector('slot[name="error"]')
        .assignedElements({ flatten: true }).length > 0;
    this.isSuccessContent =
      this.shadowRoot
        .querySelector('slot[name="success"]')
        .assignedElements({ flatten: true }).length > 0;
  }

  render() {
    return html` <div
        class="notification pending ${classMap({ hidden: !this.isPendingShown || !this.isPendingContent })}"
      >
        <slot name="pending"></slot>
      </div>
      <div
        class="notification error ${classMap({ hidden: !this.isErrorShown || !this.isErrorContent })}"
      >
        <slot name="error"></slot>
      </div>
      <div
        class="notification success ${classMap({ hidden: !this.isSuccessShown || !this.isSuccessContent })}"
      >
        <slot name="success"></slot>
      </div>`;
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

      .hidden {
        display: none;
      }

      .notification {
        border: 1px solid black;
        padding: 16px;
        margin-bottom: 16px;
      }

      .pending {
        border: 1px solid black;
      }

      .error {
        border: 3px solid red;
      }

      .success {
        border: 3px solid green;
      }
    `;
  }
}
