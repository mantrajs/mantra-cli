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
  _generateTest('container', moduleName, entityName, config);

  _generate('component', moduleName, entityName, options, config);
  _generateTest('component', moduleName, entityName, config);
  if (config.storybook) {
    generateStorybook(name, options, config);
  }
}

export function destroyContainer(name) {
  let [moduleName, entityName] = name.split(':');

  removeFile(getOutputPath('container', entityName, moduleName));
  removeFile(getTestOutputPath('container', entityName, moduleName));

  removeFile(getOutputPath('component', entityName, moduleName));
  destroyStorybook(name);
  removeFile(getTestOutputPath('component', entityName, moduleName));
}
