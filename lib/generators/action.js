import {
  _generate, updateIndexFile, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, getOutputPath
} from './utils';

export function generateAction(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  _generate('action', moduleName, entityName);
  updateIndexFile({
    indexFilePath: `./client/modules/${moduleName}/actions/index.js`,
    exportBeginning: 'export default {',
    insertImport: `import ${entityName} from './${entityName}';`,
    insertExport: `  ${entityName}`,
    commaDelimited: true
  });
}

export function destroyAction(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  removeFile(getOutputPath('action', entityName, moduleName));
  removeFromIndexFile(`./client/modules/${moduleName}/actions/index.js`, entityName);
}
