import _ from 'lodash';
import {
  _generate, _generateTest, updateIndexFile, ensureModuleNameProvided,
  ensureModuleExists, removeFromIndexFile, removeFile, getOutputPath,
  getTestOutputPath
} from './utils';

export function generateAction(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  const {exists} = _generate('action', moduleName, entityName, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./${config.modulesPath}/${moduleName}/actions/index.js`,
      exportBeginning: 'export default {',
      insertImport: `import ${entityName} from './${_.snakeCase(entityName)}';`,
      insertExport: `  ${entityName}`,
      commaDelimited: true
    });
  }

  _generateTest('action', moduleName, entityName, config);
}

export function destroyAction(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  removeFile(getOutputPath('action', entityName, moduleName));
  removeFile(getTestOutputPath('action', entityName, moduleName));
  removeFromIndexFile(`./${config.modulesPath}/${moduleName}/actions/index.js`, entityName);
}
