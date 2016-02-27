import fs from 'fs';
import {removeSync, outputFileSync} from 'fs-extra';
import editer from 'editer';
import locater from 'locater';
import _ from 'lodash';
import {logger} from '../logger';
import {getOutputPath} from '../generators/utils';
import {removeFromFile} from '../utils';

export default function destroy(type, name) {
  let destroyFn = getDestroyFn(type);
  if (! destroyFn) {
    console.log(`Invalid type ${type}`);
    console.log('Run `mantra generate --help` for more options.');
    return;
  }

  destroyFn(name);
}

function getDestroyFn(type) {
  const destroyFnMap = {
    action: destroyAction,
    component: destroyComponent,
    container: destroyContainer,
    collection: destroyCollection,
    method: destroyMethod,
    publication: destroyPublication
  };

  return destroyFnMap[type];
}

function removeFile(path) {
  logger.remove(path);
  removeSync(path);
}

function removeWholeLine(string, regex) {

  function nthIndexOf(str, part, n) {
    let len = str.length;
    let i = -1;

    while (n-- && i++ < len) {
      i = str.indexOf(part, i);
      if (i < 0) break;
    }

    return i;
  }
  let position = locater.findOne(regex, string);

  if (! position) {
    return string;
  }

  let lineNumber = position.line;
  let lineStartIndex = nthIndexOf(string, '\n', lineNumber - 1) + 1;
  let lineEndIndex = nthIndexOf(string, '\n', lineNumber);

  return string.substring(0, lineStartIndex) + string.substring(lineEndIndex + 1);
}

function removeFromIndexFile(indexFilePath, entityName) {
  logger.update(indexFilePath);

  let regex = new RegExp(`  ${_.camelCase(entityName)}.*\n`, 'g');

  let content = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
  content = removeWholeLine(content,
    `import ${_.camelCase(entityName)} from './${_.snakeCase(entityName)}';`);
  content = removeWholeLine(content, regex);

  console.log(content);
  outputFileSync(indexFilePath, content);
}

function destroyAction(name) {
  let [moduleName, entityName] = name.split(':');

  removeFile(getOutputPath('action', entityName, moduleName));

  removeFromIndexFile(`./client/modules/${moduleName}/actions/index.js`, entityName);
}

function destroyComponent(name) {
  let [moduleName, entityName] = name.split(':');

  removeFile(getOutputPath('component', entityName, moduleName));
}

function destroyContainer(name) {
  let [moduleName, entityName] = name.split(':');

  removeFile(getOutputPath('container', entityName, moduleName));
  removeFile(getOutputPath('component', entityName, moduleName));
}

function destroyCollection(name) {
  removeFile(getOutputPath('collection', name));

  removeFromIndexFile(`./lib/collections/index.js`, name);
}

function destroyMethod(name) {
  removeFile(getOutputPath('method', name));

  removeFromIndexFile(`./server/methods/index.js`, name);
}

function destroyPublication(name) {
  removeFile(getOutputPath('publication', name));

  removeFromIndexFile(`./server/publications/index.js`, name);
}
