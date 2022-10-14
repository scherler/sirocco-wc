# Scaffolding Tool for the fusion of lit with tailwind. DRY development in the speed of light.

This tool helps you to develop with [lit](https://lit.dev/docs/) and [tailwind](https://tailwindcss.com/docs). It provides not only scaffolding but as well the infrastucture to generate component specific style definitions.

## Why the name?

I was looking for a word that unifies with tailwind and lit (fart-on-fire 🤭 would have been a good picture that fits but ...). A Mediterranean wind that comes from the Sahara and reaches hurricane speeds in North Africa and Southern Europe, is the definition of sirocco and since I wrote it based in Sevilla, I found it fitting. 😁 

## Install

```bash
npm i -g sirocco-wc
```

You should install the tool globally so you can use it to generate node based projects with the `init` command.

## Usage

In case you have not yet a node based project installed, you can use the init command, however, be aware that it will override existing files.

```bash
mkdir test
cd test
sirocco-wc init
```

After this you will need to create a first component and then the entry file that you have defined in the init command.

```bash
sirocco-wc add test
echo "export * from './components/index';" > src/main/ts/index.ts
```

The last step is to update the `index.html` that was generated earlier to use your first web component. 

```html 
  <body>
    add your first web component here
    <swc-test></swc-test>
  </body>
  ```

Once you have the basic structure set up, you can either use the project commands or the sirocco-wc once.

First, you need to install the dependencies and then can run the local dev server.

```bash
yarn
yarn start
```

## help 

```bash
sirocco-wc help
```

COMMANDS — Type 'sirocco-wc help <command>' to get some help about a command

## Customize

You can set different environments variable to change the default configuration of this tool, which you can find in `bin/config.js`:

```js
const defaultComponentType = process.env.SWC_TYPE || 'components';
const prefix = process.env.SWC_PREFIX || 'swc-';
const index = process.env.SWC_INDEX || 'index.ts';
const srcDir = process.env.SWC_SRC || `src/main/ts`
const destDir = process.env.SWC_DEST || `./src/main/webapp/js`
const cssDir = process.env.SWC_CSS || `${srcDir}\/\*\*\/\*.css`
```

## Commands available

```js
command("init", "Scaffolding your project")

command("add", "add component")
  .argument("<component>", "Name of the component")
  .option("-t, --type <type>", "Component Type", {
    default: defaultComponentType,
  })

command("buildCss", "Building style.ts files")

command("watchCss", "Watch changes and rebuild")
```

### init - Scaffolding your project

```bash
sirocco-wc init
```

Scaffolding your project to add the infrastructure needed to develop as described in [template](./bin/template/README.md)

### add - Create a new component

```bash
sirocco-wc add newcomponent [componentType || 'components']
```

This will create a new component (or the `componentType` you have chosen) and link it in the project hierarchy.

For example if you want to create a new view you can do:

```bash
sirocco-wc add myview views
```

### buildCss - Building style.ts files

```bash
sirocco-wc buildCss
```

Will generate style definitions so they can be imported into your web components. The files are optimized to only include some general tailwind plugins and the classes you may defined in your css or template.

### watchCss - Watch changes and rebuild

```bash
sirocco-wc watchCss
```

Will watch css and ts files and invoke the rebuild in case they have changed.
