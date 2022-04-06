# JSON Forms Vuetify renderers

This is a monorepo containing the JSON Forms Vue 2 Vuetify renderers and an example application.

See [jsonforms-vuetify-renderers.netlify.app](https://jsonforms-vuetify-renderers.netlify.app) for the deployed example application.

## JSON Forms

See [jsonforms.io](https://jsonforms.io/) and the [main repository](https://github.com/eclipsesource/jsonforms) for more information about JSON Forms.

## Vue2 Vuetify renderer set

See the [README](https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/README.md) of the Vue 2 Vuetify renderer set for detailed instructions on how to consume and use the JSON Forms Vue 2 Vuetify renderer set.

## Developer documentation

Use Node 12+

### Initial setup

- Install monorepo dependencies: `npm ci`
- Hook up dependencies between packages: `npm run init`

### Develop Scripts

- Remove build artifacts: `npm run clean`
- Run core vue2 app: `npm run vue2:watch`
- Build and watch the renderer set: `npm run watch`
- Build editor app for develop: `npm run editor:serve`

### Production Scripts

- Build the renderer set: `npm run build`
