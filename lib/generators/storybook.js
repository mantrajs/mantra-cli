import _ from 'lodash';

import {
  _generate, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, getOutputPath, updateIndexFile
} from './utils';

export function generateStorybook(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  _generate('storybook', moduleName, entityName, options, config);
  updateIndexFile({
    indexFilePath: `./client/modules/${moduleName}/components/.stories/index.js`,
    exportBeginning: 'export default {',
    insertImport: `import ${entityName} from './${_.snakeCase(entityName)}';`,
    insertExport: `  ${entityName}`,
    commaDelimited: true
  });
}

export function destroyStorybook(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  removeFile(getOutputPath('storybook', entityName, moduleName));
  removeFromIndexFile(`./client/modules/${moduleName}/components/.stories/index.js`, entityName);
}
