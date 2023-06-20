import { HomeAssistant } from 'custom-card-helpers';
import { LitElement, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

type Template = TemplateResult | string | typeof nothing;
type UnsubscribePromise = Promise<() => Promise<void>>;
type UnsubscribeError = Error & { code: string };

export class HATemplate extends LitElement {
  @property() public hass!: HomeAssistant;

  @property() public template = '';
  @property() public variables: Record<string, unknown> = {};
  @property() public value: string | null = null;

  @state() private unsubscribePromise: UnsubscribePromise | null = null;

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
      } catch (err: unknown) {
        // We don't care when connection is closed.
        if ((err as UnsubscribeError).code !== 'not_found') {
          throw err;
        }
      }
    }
  }

  protected render(): Template {
    return this.value ?? nothing;
  }
}

export default function register(componentName = 'ha-template') {
  if (!customElements.get(componentName)) {
    customElements.define(componentName, HATemplate);
  }
}
