<div style="text-align:center"><img src="logo.png" /></div>

# Scaffolding Tool for the fusion of lit with tailwind. 
### DRY development in the speed of light with the zero configuration build tool parcel, playwright, and jest testing. Jenkins plugin ready

This tool helps you to develop with
 [lit](https://lit.dev/docs/), [tailwind](https://tailwindcss.com/docs), [playwright](https://playwright.dev/), and [parcel](https://parceljs.org/).
 It provides not only scaffolding but as well the infrastructure to generate component-specific style definitions. Further, our defaults are ready for being used in a Jenkins plugin.

## Why the name?

I was looking for a word that unifies tailwind with lit. A Mediterranean wind that comes from the Sahara and reaches hurricane speeds in North Africa and Southern Europe, is the definition of sirocco and since I wrote it based in Sevilla, I found it fitting. 😁

![Sirocco wind](sirocco.jpg "Sirocco wind")

## Claude Code Support

This project includes comprehensive Claude Code support with expert personalities that understand sirocco-wc architecture, Lit web components, Tailwind CSS integration, and Jenkins plugin development patterns.

For AI-assisted development:
- See [CLAUDE.md](./CLAUDE.md) for project guidance and architecture details
- Explore `.clauderc-personalities/` for specialized expert personalities including:
  - **sirocco-webcomponent-expert**: Complete mastery of Lit + Tailwind + Sirocco patterns, global theming system
  - **sirocco-integration-expert**: Jenkins plugin integration and build system expertise
  - **sirocco-dependency-expert**: Dependency management, package updates, Yarn Berry setup
  - **sirocco-testing-expert**: Playwright E2E, Jest unit testing, Shadow DOM testing strategies

These personalities provide proven patterns, best practices, and detailed implementation guidance for working with sirocco-wc projects.

## Install

```bash
npm i -g sirocco-wc
```

You should install the tool globally so you can use it to generate node based projects with the `init` command.

## Customize

You can set different environments variable to change the default configuration of this tool, which you can find in `bin/config.js`:

```js
const defaultComponentType = process.env.SWC_TYPE || 'components';
const prefix = process.env.SWC_PREFIX || 'swc-';
const index = process.env.SWC_INDEX || 'index.ts';
const srcDir = process.env.SWC_SRC || `src/main/ts`
const cssDir = process.env.SWC_CSS || `${srcDir}\/\*\*\/\*.css`
```

## Commands available
### Version

```bash
sirocco-wc --version
```
### help 

```bash
sirocco-wc help
COMMANDS — Type 'sirocco-wc help <command>' to get some help about a command
```

### init - Scaffolding your project

```bash
sirocco-wc ["init" || "i"]
```

Scaffolding your project to add the infrastructure needed to develop as described in the [README](./bin/template/README.md) of the template.

This structure allows to quickly develop with lit and tailwind. Further our defaults are ready for being used in a jenkins plugin. It will further direcly migrate to yarn 2 and install some recommended plugins.

...but wait there is still more to the template:

- yarn2 based
- typescript based
- playwright testing integration
- jest testing integration
- parcel zero config based compilation and optimisation integration.
- prettier, lint and husky integration ready
- npm publish ready

### add - Create a new component

.option("-t, --type <type>", "Component Type", {
    default: defaultComponentType,
  })

```bash
sirocco-wc ["add"||"a"] newcomponent [-t componentType || 'components']
```

This will create a new component (or the `componentType` you have chosen) and link it in the project hierarchy.

For example if you want to create a new view you can do:

```bash
sirocco-wc add myview -t views
```

### buildCss - Building style.ts files

```bash
sirocco-wc ["buildCss"||"bc"]
```

Will generate style definitions so they can be imported into your web components. The files are optimized to only include some general tailwind plugins and the classes you may defined in your css or template.

### watchCss - Watch changes and rebuild

```bash
sirocco-wc ["watchCss"||"wc"]
```

Will watch css and ts files and invoke the rebuild in case they have changed.

## Usage sample

In case you have not yet a node based project installed, you can use the init command, however, be aware that it will override existing files.

```bash
mkdir test
cd test
sirocco-wc i
```

After this you will need to create a first component and then the entry file that you have defined in the init command. You can use `yarn :add test` to use the prefix that you have choosen in the init command.

```bash
sirocco-wc a test
echo "export * from './components/index';" > src/main/ts/index.ts
```

The last step is to update the `index.html` that was generated earlier to use your first web component. 

```html 
  <body>
    <swc-test></swc-test>
  </body>
  ```

Once you have the basic structure set up, you can either use the project commands or the sirocco-wc once.

First, you need to run the local dev server.

```bash
yarn start
```

### Sample use in package.json

```package.jsonc
"css:build": "sirocco-wc bc",
"css:watch": "sirocco-wc wc",
":add": "SWC_PREFIX=my-sirocco- sirocco-wc a"
```
