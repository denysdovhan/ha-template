[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner-direct-single.svg)](https://stand-with-ukraine.pp.ua/)

# HATemplate

[![npm version][npm-image]][npm-url]
[![Patreon][patreon-image]][patreon-url]
[![Buy Me A Coffee][buymeacoffee-image]][buymeacoffee-url]
[![Twitter][twitter-image]][twitter-url]

> A tiny (<2kB) lit component for rendering templates in [Home Assistant][home-assistant] custom cards

`ha-template` is a tiny Lit component that conveniently handles rendering templates in [Home Assistant][home-assistant] custom cards. It subscribes to template updates, automatically rerenders them along with the template value and displays a fallback value if template is not available.

## Installing

**💡 Tip:** If you like this project, consider becoming a patron:

<a href="https://patreon.com/denysdovhan">
  <img alt="Become a patron" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="150px">
</a>

or just buy me a cup of ☕️ or 🥤:

<a href="https://www.buymeacoffee.com/denysdovhan" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/default-black.png" alt="Buy Me A Coffee" width="150px">
</a>

Install this utility as any other dependency:

```sh
npm install -S ha-template
# or
yarn add ha-template
```

## Usage

Use `ha-template` in your card by importing and registering it as a custom component.

Pass `hass` object, `template` string and optional falback `value`. `ha-template` will handle template rendering and updating automatically.

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
    // Pass hass object, template and a fallback value.
    // Fallback value will replace with the result of rendered template.
    // If template is not defined, fallback value will be used.
    return html`
      <ha-card>
        <ha-template
          hass=${this.hass}
          template=${value_template}
          value=${fallback}
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
1. `default` - a function that registers `HATemplate` as a `ha-tempalte` custom element, by default. You can pass custom component name, if you want so.

`HATemplate` component accepts these properties:

1. `hass` - an object of Home Assistant connection.
2. `template` - a string that contains a [Jinja2](https://palletsprojects.com/p/jinja) template.
3. `value` - a fallback value that will be used if template is not defined. Will be replaced by template result.
4. `variables` - an object of custom variables to be used within the template.

## Development

Want to contribute to the project?

First of all, thanks! Check [contributing guideline](./CONTRIBUTING.md) for more information.

## License

MIT © [Denys Dovhan][denysdovhan]

<!-- Badges -->

[npm-url]: https://npmjs.org/package/ha-template
[npm-image]: https://img.shields.io/npm/v/ha-template.svg?style=flat-square
[patreon-url]: https://patreon.com/denysdovhan
[patreon-image]: https://img.shields.io/badge/support-patreon-F96854.svg?style=flat-square
[buymeacoffee-url]: https://patreon.com/denysdovhan
[buymeacoffee-image]: https://img.shields.io/badge/support-buymeacoffee-222222.svg?style=flat-square
[twitter-url]: https://twitter.com/denysdovhan
[twitter-image]: https://img.shields.io/badge/twitter-%40denysdovhan-00ACEE.svg?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[denysdovhan]: https://denysdovhan.com
