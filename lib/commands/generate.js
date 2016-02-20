import fs from 'fs';
import path from 'path';
import {mkdirsSync, copySync, outputFileSync} from 'fs-extra';
import {template, capitalize} from 'lodash';
import {green, yellow} from 'colors';

function getOutputPath(type, moduleName, entityName) {
  const extensionMap = {
    action: 'js',
    component: 'jsx',
    configs: 'js',
    container: 'js'
  };
  let extension = extensionMap[type];
  let outputFileName = `${entityName}.${extension}`;

  return `./client/modules/${moduleName}/${type}s/${outputFileName}`;
}

function getTemplatePath(type, moduleName) {
  return path.resolve(
    __dirname,
    `../../templates/client/modules/${moduleName}/${type}s/generic.tt`
  );
}

function readTemplateContent(type, moduleName) {
  let templatePath = getTemplatePath(type, moduleName);

  return fs.readFileSync(templatePath);
}

function getTemplateVaraibles(type, entityName) {
  if (type === 'component') {
    return {componentName: capitalize(entityName)};
  } else if (type === 'container') {
    return {
      componentName: capitalize(entityName),
      componentFileName: entityName
    };
  }

  return {};
}

export default function generate(type, name) {
  let [moduleName, entityName] = name.split(':');

  function _generate(type, moduleName, entityName) {
    let templateContent = readTemplateContent(type, moduleName);
    let outputPath = getOutputPath(type, moduleName, entityName);
    let templateVariables = getTemplateVaraibles(type, entityName);
    let component = template(templateContent)(templateVariables);

    fs.writeFileSync(outputPath, component);
    console.log(green(`Generated ${type}: `) + outputPath);
  }

  if (type === 'container') {
    _generate('container', moduleName, entityName);
    _generate('component', moduleName, entityName);
  } else if (type === 'component') {
    _generate('component', moduleName, entityName);
  } else if (type === 'action') {
    _generate('action', moduleName, entityName);
    // TODO: Edit actions/index.js
  }
}
