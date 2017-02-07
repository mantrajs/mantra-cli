import {
  _generate, _generateTest, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, getOutputPath, getTestOutputPath
} from './utils';

import {generateStorybook, destroyStorybook} from './storybook';

export function generateContainer(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  _generate('container', moduleName, entityName, options, config);
  if(config.generateContainerTests) {
    _generateTest('container', moduleName, entityName, config);
  }

  _generate('component', moduleName, entityName, options, config);

  if(config.generateComponentTests) {
    _generateTest('component', moduleName, entityName, config);
  }

  if (config.storybook) {
    generateStorybook(name, options, config);
  }
}

export function destroyContainer(name, options, config) {
  let [moduleName, entityName] = name.split(':');

  removeFile(getOutputPath('container', entityName, moduleName));
  if(config.generateContainerTests) {
    removeFile(getTestOutputPath('container', entityName, moduleName));
  }

  removeFile(getOutputPath('component', entityName, moduleName));
  destroyStorybook(name);
  if(config.generateContainerTests) {
    removeFile(getTestOutputPath('component', entityName, moduleName));
  }
}
