import {
  _generate, _generateTest, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, getOutputPath, getTestOutputPath
} from './utils';

export function generateComponent(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  _generate('component', moduleName, entityName, options, config);
  _generateTest('component', moduleName, entityName);
}

export function destroyComponent(name) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  removeFile(getOutputPath('component', entityName, moduleName));
  removeFile(getTestOutputPath('component', entityName, moduleName));
}
