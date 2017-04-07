import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {execSync} from 'child_process';
import {outputFileSync} from 'fs-extra';
import shelljs from 'shelljs/shell';
import yaml from 'js-yaml';

import {parseYamlFromFile, checkFileExists, createDir, getFileContent, createFile, getLineBreak} from '../utils';
import {getConfig} from '../config_utils';
import {logger} from '../logger';
import {generateModule} from '../generators/module';

export default function create(appPath, options = {}) {
  if (checkFileExists(`${shelljs.pwd()}/.meteor`)) {
    console.log('You are already in a Meteor project');
    return;
  }

  if (!appPath) {
    console.log('Please supply the path of project');
    console.log('Run `mantra create --help` for more options.');
    return;
  }

  const customConfigFilePath = options.config;
  let customConfig = {};
  // if custom config file path is provided, use this to create a new app
  if(_.isString(customConfigFilePath) && checkFileExists(customConfigFilePath)) {
    customConfig = parseYamlFromFile(customConfigFilePath);
  }
  // save full config file in project
  const config = getConfig(customConfig);

  const templatesPath = `${__dirname}/../../templates`;
  //const targetModulePath = `${appPath}${config.modulesPath}`;
  const lineBreak = getLineBreak();
  let appName = path.basename(appPath).replace(/\..*$/, '');

  createDir(`${appPath}`);

  if (process.env.NODE_ENV !== 'test') {
    logger.invoke('init');
    shelljs.set('-e');
    shelljs.exec(`meteor create ${appPath}`, {silent: !options.verbose});
    shelljs.pushd(appPath);
    shelljs.rm('-rf', ['client', 'server']);
    `kadira:flow-router${lineBreak}`.toEnd('.meteor/packages');
    shelljs.rm('-rf', ['client', 'server']);
    `reactive-dict${lineBreak}`.toEnd('.meteor/packages');
    shelljs.popd();
  }
  // copy config
  outputFileSync(`${appPath}/mantra_cli.yaml`, yaml.safeDump(config));

  createFile(`${templatesPath}/client/configs/context.js`,
           `${appPath}/client/configs/context.js`);
  createFile(`${templatesPath}/client/main.js`,
           `${appPath}/client/main.js`);

  createFile(`${templatesPath}/lib/collections/index.js`,
           `${appPath}/lib/collections/index.js`);
  createDir(`${appPath}/server/configs`);
  createFile(`${templatesPath}/server/main.js`,
           `${appPath}/server/main.js`);
  createFile(`${templatesPath}/server/methods/index.js`,
           `${appPath}/server/methods/index.js`);
  createFile(`${templatesPath}/server/publications/index.js`,
           `${appPath}/server/publications/index.js`);
  createFile(`${templatesPath}/package.tt`,
          `${appPath}/package.json`, {appName: appName});
  createFile(`${templatesPath}/gitignore.tt`,
          `${appPath}/.gitignore`);
  createFile(`${templatesPath}/eslintrc.tt`,
          `${appPath}/.eslintrc`);
  createFile(`${templatesPath}/babelrc.tt`,
          `${appPath}/.babelrc`);
  createFile(`${templatesPath}/.scripts/mocha_boot.tt`,
          `${appPath}/.scripts/mocha_boot.js`);

  // Generate storybook related files
  if (config.storybook) {
    createDir(`${appPath}/.storybook`);
    createFile(`${templatesPath}/.storybook/config.js`,
      `${appPath}/.storybook/config.js`);
    createFile(`${templatesPath}/.storybook/webpack.config.js`,
      `${appPath}/.storybook/webpack.config.js`);

  }

  shelljs.pushd(appPath);
  generateModule("core", options, config);
  shelljs.popd();

  if (process.env.NODE_ENV !== 'test') {
    logger.invoke('after_init');
    shelljs.set('-e');
    shelljs.pushd(appPath);
    shelljs.exec('npm install', {silent: !options.verbose});
    shelljs.popd();
  }

  console.log('');
  console.log(`Created a new app using Mantra v0.2.0 at ${appPath}`);
  console.log('');
  console.log('To run your app:');
  console.log(`  cd ${appPath}`);
  console.log(`  meteor`);
  console.log('');
  console.log('For the full Mantra specifications, see: https://kadirahq.github.io/mantra');
}
