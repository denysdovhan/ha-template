[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct-single.svg)](https://stand-with-ukraine.pp.ua/)

# Home Assistant Template Component

[![npm version][npm-image]][npm-url]
[![GitHub Sponsors][gh-sponsors-image]][gh-sponsors-url]
[![Buy Me A Coffee][buymeacoffee-image]][buymeacoffee-url]
[![Twitter][twitter-image]][twitter-url]

> [!NOTE]
> A tiny (<2kB) lit component for rendering templates in [Home Assistant][home-assistant] custom cards

`ha-template` is a tiny Lit component that conveniently handles rendering templates in [Home Assistant][home-assistant] custom cards. It subscribes to template updates, rerenders when relevant inputs change, and displays a fallback value if template output is not available.

## Sponsorship

Your generosity will help me maintain and develop more projects like this one.

- 💖 [Sponsor on GitHub][gh-sponsors-url]
- ☕️ [Buy Me A Coffee][buymeacoffee-url]
- Bitcoin: `bc1q7lfx6de8jrqt8mcds974l6nrsguhd6u30c6sg8`
- Ethereum: `0x6aF39C917359897ae6969Ad682C14110afe1a0a1`

## Installing

Install this utility as any other dependency:

```sh
npm install -S ha-template
# or
yarn add ha-template
```

## Usage

Use `ha-template` in your card by importing and registering it as a custom component.

Pass `hass` object, `template` string and optional fallback `value`. `ha-template` will handle template rendering and updating automatically.

```js
import registerTemplates from 'ha-template';

// Register ha-template component.
// You can pass custom component name, if you want so.
registerTemplates();

class MyCustomCard extends LitElement {
  static get properties() {
    return {
      hass: Object,
      config: Object,
    };
  }

  setConfig(config) {
    this.config = config;
  }

  render() {
    const value_template = this.config;
    const fallback = 'Unknown';

    // Use <ha-template> in your card.
    //
    // Pass hass object, template and fallback value.
    // If template is not defined or can not be rendered, fallback value is shown.
    // If you need `value` in the template, pass it explicitly via `variables`.
    return html`
      <ha-card>
        <ha-template
          hass=${this.hass}
          template=${value_template}
          value=${fallback}
          variables=${{ foo: 'bar' }}
        ></ha-template>
      </ha-card>
    `;
  }
}
```

Alternatively, you can register `HATemplate` as a custom element on your own:

```js
import { HATemplate } from 'ha-template';

// Register HATemplate as a custom element.
customElements.define(component, HATemplate);
```

## API

`ha-template` has two exports:

2. `HATemplate` - a custom lit-component that provides a convenient way to render templates. You can import it and register it as a custom element.
1. `default` - a function that registers `HATemplate` as a `ha-template` custom element, by default. You can pass custom component name, if you want so.

`HATemplate` component accepts these properties:

1. `hass` - an object of Home Assistant connection.
2. `template` - a string that contains a [Jinja2](https://palletsprojects.com/p/jinja) template.
3. `value` - an input fallback value used when template is not defined or can not be rendered.
4. `variables` - an object of custom variables to be used within the template.

`value` is rendered as fallback when template is empty, unavailable, or can not be rendered.

## Development

Want to contribute to the project?

First of all, thanks! Check [contributing guideline](./CONTRIBUTING.md) for more information.

## License

MIT © [Denys Dovhan][denysdovhan]

<!-- Badges -->

[npm-url]: https://npmjs.org/package/ha-template
[npm-image]: https://img.shields.io/npm/v/ha-template.svg?style=flat-square
[gh-sponsors-url]: https://github.com/sponsors/denysdovhan
[gh-sponsors-image]: https://img.shields.io/github/sponsors/denysdovhan?style=flat-square
[buymeacoffee-url]: https://patreon.com/denysdovhan
[buymeacoffee-image]: https://img.shields.io/badge/support-buymeacoffee-222222.svg?style=flat-square
[twitter-url]: https://x.com/denysdovhan
[twitter-image]: https://img.shields.io/badge/follow-%40denysdovhan-000000.svg?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[denysdovhan]: https://denysdovhan.com
