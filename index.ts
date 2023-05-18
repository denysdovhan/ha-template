import { HomeAssistant } from 'custom-card-helpers';
import { LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type UnsubscribePromise = Promise<() => Promise<void>>;

@customElement('ha-template')
export class HATemplate extends LitElement {
  @property() public hass!: HomeAssistant;

  @property() public template: string = '';
  @property() public variables: Record<string, any> = {};
  @property() public value: string | null = null;

  @property({ attribute: false })
  private unsubscribePromise: UnsubscribePromise | null = null;

  public connectedCallback() {
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

    this.unsubscribePromise = this.hass.connection.subscribeMessage<{
      result: string;
    }>(
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

  public async disconnectedCallback() {
    super.disconnectedCallback();

    if (this.unsubscribePromise) {
      try {
        const unsubscribe = await this.unsubscribePromise;
        this.unsubscribePromise = null;
        return unsubscribe();
      } catch (err: any) {
        // We don't care when connection is closed.
        if (err.code !== 'not_found') {
          throw err;
        }
      }
    }
  }

  protected render(): string | typeof nothing {
    return this.value ?? nothing;
  }
}

export default function register(component = 'ha-template') {
  if (!customElements.get(component)) {
    customElements.define(component, HATemplate);
  }
}
