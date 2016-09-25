import {expect} from 'chai';
import fse from 'fs-extra';
import _ from 'lodash';
import yaml from 'js-yaml';

import {readConfig, getDefaultConfig} from '../dist/utils';
import {setupTestApp, teardownTestApp, checkFileOrDirExists} from './test_helpers';

describe("readConfig", function() {
  it("reads default configs if there is no config file", function() {
    let config = readConfig();
    let defaultConfig = getDefaultConfig(); // TODO: make default config into a constant

    expect(_.isEqual(config, defaultConfig)).to.equal(true);
  });

  describe("when user config is provided", function() {
    let dummyConfigPath = './mantra_cli.yaml';

    before(function() {
      fse.outputFileSync(dummyConfigPath, 'tabSize: 4');
    });

    after(function() {
      fse.removeSync(dummyConfigPath);
    });

    it("returns a config with values overwritten with user config", function() {
      let config = readConfig();
      expect(config.tabSize).to.equal(4);
    });
  });
});

describe("getDefaultConfig", function() {
  it("returns a default config", function() {
    let defaultConfig = getDefaultConfig();
    expect(_.isEqual({ tabSize: 2, storybook: false }));
  });
});
