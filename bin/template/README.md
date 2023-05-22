# [NAME]
[DESCRIPTION]

# UI 

The UI is ready to be consumed in a jenkins plugin and will be automatic created when you run `mvn install`. 
However, you can use different environments for development.

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

Our components are developed with [lit](https://lit.dev/docs/)

## Prepare

Run `yarn` if you have not run `mvn install`.

## Development 

For rapid development, we recommend to use the local demo environment and 
as soon you want to test on the server run the `build`

### Local Demo with `parcel`

```bash
yarn start

Server running at http://localhost:1234
```

To run a local development server that serves the basic demo located in `index.html`

## Build for jenkins 
You can build the project with the `yarn build` command which will invoke `yarn css:build` and then will use `parcel` to package the build into one file `[DEST]/[INDEX]` which contains all the necessary information for css and js (as well registering new web components).

This is the file your main `jelly` should import and normally a hard refresh on the jenkins plugin should update the view after you have invoked the build again.

```jelly
<script type="module" src="${resURL}/plugin/$PLUGIN~NAME/js/index.js" />
<link rel="stylesheet" href="${resURL}/plugin/$PLUGIN~NAME/js/index.css" type="text/css" />
```

## How to develop the front end

Typically you would use jelly tags to produce the UI for Jenkins however to allow a modern architecture we decided to use typescript instead.

The source code can be found in `src/main/ts` within that directory we expose components, views, and helper.

```bash
src/main/ts ◎ tree -L 1 .
.
├── components
├── helper
├── index.ts
└── views
```

In the helper directory, we expose functions that are used in the components and the views.

The view folder contains aggregations of components and glue HTML. The principal view for the jelly front-end is `main`. Here we define the tabs which are views on their own. To render the tabs we are using material ui web components, actually, for all common components, we fall back to mwc components where it is possible. 

The configuration of the application is done using the attribute `configstring`. In the index.jelly we are parsing the information we have injected from the java class (aka `${it.}`) and hand them over to the front end.

We are using [lit](https://lit.dev/), to learn more about lit we recommend the interactive [tutorials](https://lit.dev/tutorials/)

### The anatomy of a view/component

```bash
◎ tree -L 1 src/main/ts/views/main 
src/main/ts/views/main
├── index.ts
├── Main.css
├── Main.styles.ts
└── Main.ts

0 directories, 4 files
```

To allow automatic wiring and export of all web components, we recommend using one folder per component/view and [barrels](https://basarat.gitbook.io/typescript/main-1/barrel). The `*.styles.ts` file is generated so do not edit it since it will be overridden by the build process. You can either use the `*.css` file to define your styles or use tailwind-driven classes, which will then be exported to the `*.styles.ts` file.

### Create a new component

```bash
yarn :add newcomponent [ -t componentType || 'components' ]
```

This will create a new component (or the `componentType` you have chosen) and link it in the project hierarchy. 
If you do not define it we will fallback to `process.env.SWC_PREFIX` or `components`

For example if you want to create a new view you can do:

```bash
yarn :add myview -t views
```

### Styles

We use [tailwind](https://tailwindcss.com/docs) as underlying framework, you can either use it in your html/js or use it in the css file of the component.
We need the css file to exist since it will trigger the generation of the style definition file (it is heavily bootstrapped to only include the styles we need for the component). All components are using shadow DOM hence need to encapsulate their styles, since there is no leakage between the overall page and the component itself. e.g. you can have 2 classes with the same name defined but they are only in the scope of themselves not changing the other web component.

### husky integration

In case your project is in the top level you can activate husky support by adding the following to the script section of your `package.json`:

```package.json
"prepare": "husky install",
```

In case your project is not in the top level you can still activate it, however you need to change the command and adopt the path to:


```package.json
"prepare": "cd .. && husky install ./YOUR_PROJECT/.husky",
```
