import _ from 'lodash';
import {
  _generate, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, getOutputPath, updateIndexFile
} from './utils';

export function generateStorybook(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);
  const {exists} = _generate('storybook', moduleName, entityName, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./client/modules/${moduleName}/components/.stories/index.js`,
      insertImport: `import ${entityName} from './${_.snakeCase(entityName)}';`,
      omitExport: true
    });
  }
}

export function destroyStorybook(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);
  const storyFile = getOutputPath('storybook', entityName, moduleName);
  removeFile(storyFile);
  removeFromIndexFile(`./client/modules/${moduleName}/components/.stories/index.js`, entityName);
}
