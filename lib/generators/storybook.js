import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import { outputFileSync } from 'fs-extra'

import {
  _generate, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, removeWholeLine, getOutputPath, updateIndexFile
} from './utils';

import {insertToFile} from '../utils'; // caution: different utils-file

const storybookPath = `./.storybook`;
const configFile = `${storybookPath}/config.js`
const storyRequireStatement = storyFile =>
  `require('${path.relative(storybookPath, storyFile)}');`

export function addToStorybookConfig({storyFile, config}) {
  const statement = storyRequireStatement(storyFile);
  let tab = ' '.repeat(config.tabSize);
  insertToFile(configFile, tab+statement,
    {after: {regex: /loadStories[^{]*{/g},asNewLine: true}
  );
}
export function removeFromStorybookConfig({storyFile}) {
  let content = fs.readFileSync(configFile, {encoding: 'utf-8'});
  const statement = storyRequireStatement(storyFile)
  console.log("remove", statement, "from", content)
  content = removeWholeLine(content, statement);
  outputFileSync(configFile, content);
}

export function generateStorybook(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  const storyFile = _generate('storybook', moduleName, entityName, options, config);
  addToStorybookConfig({storyFile, config});
  updateIndexFile({
    indexFilePath: `./client/modules/${moduleName}/components/.stories/index.js`,
    insertImport: `import ${entityName} from './${_.snakeCase(entityName)}';`,
    omitExport: true
  });
}

export function destroyStorybook(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);
  const storyFile = getOutputPath('storybook', entityName, moduleName);
  removeFromStorybookConfig({storyFile});
  removeFile(storyFile);
  removeFromIndexFile(`./client/modules/${moduleName}/components/.stories/index.js`, entityName);
}
