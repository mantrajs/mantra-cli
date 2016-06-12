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

  _generate('action', moduleName, entityName, options, config);
  updateIndexFile({
    indexFilePath: `./client/modules/${moduleName}/actions/index.js`,
    exportBeginning: 'export default {',
    insertImport: `import ${entityName} from './${_.snakeCase(entityName)}';`,
    insertExport: `  ${entityName}`,
    commaDelimited: true
  });

  _generateTest('action', moduleName, entityName);
}

export function destroyAction(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  removeFile(getOutputPath('action', entityName, moduleName));
  removeFile(getTestOutputPath('action', entityName, moduleName));
  removeFromIndexFile(`./client/modules/${moduleName}/actions/index.js`, entityName);
}
