import _ from 'lodash';
import yaml from 'js-yaml';
import {checkFileExists, parseYamlFromFile} from './utils';

export const DEFAULT_CONFIG = {
  tabSize: 2,
  storybook: false,
  generateComponentTests: true,
  generateContainerTests: true,
  modulesPath: 'client/modules'
};

/**
 * getConfig returns a full config object based on the default config
 * and overriding values.
 *
 * @param customConfig {Object} - key values pairs to override the default config
 * @return {Object} - custom config
 */
export function getConfig(customConfig = {}) {
  let config = _.clone(DEFAULT_CONFIG);
  return _.assign(config, customConfig);
}


/**
 * readCustomConfig parses `mantra_cli.yaml` and returns an object containing configs
 * if `mantra_cli.yaml` exists in the app root. Otherwise, it returns an empty object
 */
export function readCustomConfig() {
  let userConfigPath = './mantra_cli.yaml';


  // If user config exists, override defaultConfig with user config
  if (checkFileExists(userConfigPath)) {
    return parseYamlFromFile(userConfigPath);
  }

  return {};
}
