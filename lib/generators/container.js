import {
  _generate, _generateTest, ensureModuleNameProvided, ensureModuleExists,
  removeFromIndexFile, removeFile, getOutputPath, getTestOutputPath
} from './utils';
import {getConfig} from '../config_utils';
import {generateStorybook, destroyStorybook} from './storybook';

export function generateContainer(name, options, customConfig) {
  const config = getConfig(customConfig);
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName, customConfig);

  _generate('container', moduleName, entityName, options, config);
  if(config.generateContainerTests) {
    _generateTest('container', moduleName, entityName, config);
  }

  _generate('component', moduleName, entityName, options, config);

  if(config.generateComponentTests) {
    _generateTest('component', moduleName, entityName, config);
  }

  if (config.storybook) {
    generateStorybook(name, options, customConfig);
  }
}

export function destroyContainer(name, options, customConfig) {
  let [moduleName, entityName] = name.split(':');

  removeFile(getOutputPath(customConfig, 'container', entityName, moduleName));
  removeFile(getTestOutputPath('container', entityName, moduleName));
  removeFile(getOutputPath(customConfig, 'component', entityName, moduleName));
  destroyStorybook(name, options, customConfig);
  removeFile(getTestOutputPath('component', entityName, moduleName));

}
