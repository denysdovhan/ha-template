import { LitElement, nothing } from 'lit';

export class HATemplate extends LitElement {
  static get properties() {
    return {
      hass: Object,
      template: String,
      variables: Object,
      value: String,
    };
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.hass) {
      console.warn('hass object is not provided');
      return;
    }

    if (this.unsubscribePromise) {
      return;
    }

    if (!this.template) {
      return;
    }

    this.unsubscribePromise = this.hass.connection.subscribeMessage(
      (msg) => {
        this.value = msg.result;
      },
      {
        type: 'render_template',
        template: this.template,
        variables: this.variables,
      }
    );
  }

  async disconnectedCallback() {
    super.disconnectedCallback();

    if (this.unsubscribePromise) {
      try {
        const unsubscribe = await this.unsubscribePromise;
        this.unsubscribePromise = null;
        return unsubscribe();
      } catch (err) {
        // We don't care when connection is closed.
        if (err.code !== 'not_found') {
          throw err;
        }
      }
    }
  }

  render() {
    if (this.value) {
      return this.value;
    }

    return nothing;
  }
}

export default function register(component = 'ha-template') {
  customElements.define(component, HATemplate);
}
