import {
  _generate, _generateTest, ensureModuleNameProvided, ensureModuleExists,
  removeFile, getOutputPath, getTestOutputPath, updateIndexFile
} from './utils';
import {getConfig} from '../config_utils';
import {generateStorybook, destroyStorybook} from './storybook';

export function generateComponent(name, options, customConfig) {
  const config = getConfig(customConfig);
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName, customConfig);

  _generate('component', moduleName, entityName, options, config);

  if(config.generateComponentTests) {
    _generateTest('component', moduleName, entityName, config);
  }
  if (config.storybook) {
    generateStorybook(name, options, config);
  }
}

export function destroyComponent(name, options, customConfig) {

  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName, customConfig);
  removeFile(getOutputPath('component', entityName, moduleName));
  destroyStorybook(name);
  removeFile(getTestOutputPath('component', entityName, moduleName));

}
