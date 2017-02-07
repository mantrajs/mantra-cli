import {
  _generate, _generateTest, ensureModuleNameProvided, ensureModuleExists,
  removeFile, getOutputPath, getTestOutputPath, updateIndexFile
} from './utils';

import {generateStorybook, destroyStorybook} from './storybook';

export function generateComponent(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  _generate('component', moduleName, entityName, options, config);
  generateStorybook(name, options, config);
  if(config.generateComponentTests) {
    _generateTest('component', moduleName, entityName, config);
  }
}

export function destroyComponent(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  removeFile(getOutputPath('component', entityName, moduleName));
  destroyStorybook(name);

  if(config.generateComponentTests) {
    removeFile(getTestOutputPath('component', entityName, moduleName));
  }
}
