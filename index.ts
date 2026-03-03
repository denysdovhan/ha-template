import { HomeAssistant } from 'custom-card-helpers';
import { LitElement, PropertyValues, nothing } from 'lit';
import { notEqual } from '@lit/reactive-element';
import { property, state } from 'lit/decorators.js';

type UnsubscribePromise = ReturnType<
  HomeAssistant['connection']['subscribeMessage']
>;
type UnsubscribeError = Error & { code: string };

export class HATemplate extends LitElement {
  @property() public hass!: HomeAssistant;

  @property()
  public template = '';

  @property({ hasChanged: notEqual })
  public variables: Record<string, unknown> = {};

  @property()
  public value: unknown = null;

  @state()
  private renderedValue: string | null = null;

  private unsubscribePromise: UnsubscribePromise | null = null;
  private subscriptionTask: Promise<void> = Promise.resolve();

  public connectedCallback() {
    super.connectedCallback();
    this.queueSubscriptionRefresh();
  }

  protected updated(changedProperties: PropertyValues<this>) {
    if (
      changedProperties.has('hass') ||
      changedProperties.has('template') ||
      changedProperties.has('variables') ||
      changedProperties.has('value')
    ) {
      this.queueSubscriptionRefresh();
    }
  }

  public disconnectedCallback() {
    this.queueSubscriptionRefresh();
    super.disconnectedCallback();
  }

  protected render(): unknown {
    return this.renderedValue ?? this.value ?? nothing;
  }

  private queueSubscriptionRefresh() {
    this.subscriptionTask = this.subscriptionTask
      .then(() => this.refreshSubscription())
      .catch((err: unknown) => {
        // Keep the task queue usable after an unexpected error.
        console.error('ha-template: Failed to refresh subscription', err);
      });
  }

  private async refreshSubscription() {
    await this.unsubscribeTemplate();
    this.renderedValue = null;

    if (!this.isConnected) {
      return;
    }

    if (!this.hass) {
      console.warn('ha-template: hass object is not provided');
      return;
    }

    if (!this.template) {
      console.warn('ha-template: template is not provided');
      return;
    }

    this.unsubscribePromise = this.hass.connection.subscribeMessage<{
      result: string;
    }>(
      (msg) => {
        this.renderedValue = msg.result;
      },
      {
        type: 'render_template',
        template: this.template,
        variables: this.variables,
      },
    );
  }

  private async unsubscribeTemplate() {
    if (!this.unsubscribePromise) {
      return;
    }

    const unsubscribePromise = this.unsubscribePromise;
    this.unsubscribePromise = null;

    try {
      const unsubscribe = await unsubscribePromise;
      await Promise.resolve(unsubscribe());
    } catch (err: unknown) {
      // Home Assistant closes subscriptions when connection is gone.
      if ((err as UnsubscribeError).code !== 'not_found') {
        throw err;
      }
    }
  }
}

export default function register(componentName = 'ha-template') {
  if (!customElements.get(componentName)) {
    customElements.define(componentName, HATemplate);
  }
}
