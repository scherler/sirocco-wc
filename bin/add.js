const path = require("path");
const fs = require("fs");
const { prefix, source } = require("./config");

module.exports = (logger, args, options) => {
    const newComponent = args.component;
    const componentType = options.type;

    // main
    const newClass = newComponent.charAt(0).toUpperCase() + newComponent.slice(1);
    const sourceCopmponents = path.join(source, componentType);
    const sourceDir = path.join(sourceCopmponents, newComponent);

    const destIndex = path.join(sourceDir, `index.ts`);
    const destTs = path.join(sourceDir, `${newClass}.ts`);

    const destCss = path.join(sourceDir, `${newClass}.css`);

    const templateIndex = `export * from './${newClass}';
export { default as ${newClass}Style } from './${newClass}.styles';
`;
    const templateTs = `import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators'
import Styles from './${newClass}.styles';

@customElement('${prefix}${newComponent}')
export class ${newClass} extends LitElement {
  static styles = [ Styles ];

  render() {
    return html\`${prefix}${newComponent}\`;
  }
}`;

    try {
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(destTs, templateTs);
        fs.writeFileSync(
            destCss,
            "/* You do not need it but the build system does*/"
        );
        fs.writeFileSync(destIndex, templateIndex);
        fs.appendFileSync(
            `${sourceCopmponents}/index.ts`,
            `export * from './${newComponent}/index';
`
        );
        logger.info(`⚠️Finished to create ${newComponent} and linked in ${sourceCopmponents}, however you may need to link to ${sourceCopmponents} from you main js.⚠️`);
    } catch (error) {
        logger.error(error);
    }
};
