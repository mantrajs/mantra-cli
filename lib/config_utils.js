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
 * getCustomConfig returns a custom config object based on the default config
 * and overriding values.
 *
 * @param customConfig {Object} - key values pairs to override the default config
 * @return {Object} - custom config
 */
export function getCustomConfig(overrides) {
  let config = _.clone(DEFAULT_CONFIG);

  return _.assign(config, overrides);
}


/**
 * readConfig parses `mantra_cli.yaml` and returns an object containing configs
 * if `mantra_cli.yaml` exists in the app root. Otherwise, it returns a default
 * config object.
 */
export function readConfig() {
  let userConfigPath = './mantra_cli.yaml';
  let config = DEFAULT_CONFIG;

  // If user config exists, override defaultConfig with user config
  if (checkFileExists(userConfigPath)) {
    let userConfig = parseYamlFromFile(userConfigPath);
    _.assign(config, userConfig);
  }

  return config;
}
