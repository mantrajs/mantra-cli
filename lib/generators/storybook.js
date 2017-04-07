import _ from 'lodash';
import {
  _generate, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, getOutputPath, updateIndexFile
} from './utils';
import {getConfig} from '../config_utils';

export function generateStorybook(name, options, customConfig = {}) {
  let [moduleName, entityName] = name.split(':');
  const config = getConfig(customConfig);
  const snakeCaseName = _.snakeCase(name);
  const modulePath = `./${config.modulesPath}/${snakeCaseName}`;

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName, customConfig);
  const {exists} = _generate('storybook', moduleName, entityName, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./${modulePath}/components/.stories/index.js`,
      insertImport: `import ${entityName} from './${_.snakeCase(entityName)}';`,
      omitExport: true
    });
  }
}

export function destroyStorybook(name, options, customConfig = {}) {
  let [moduleName, entityName] = name.split(':');
  const config = getConfig(customConfig);
  const snakeCaseName = _.snakeCase(name);
  const modulePath = `./${config.modulesPath}/${snakeCaseName}`;

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName, customConfig);
  const storyFile = getOutputPath('storybook', entityName, moduleName);
  removeFile(storyFile);
  removeFromIndexFile(`./${modulePath}/components/.stories/index.js`, entityName);
}
