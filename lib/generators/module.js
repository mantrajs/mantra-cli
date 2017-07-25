import fs from 'fs';
import _ from 'lodash';
import {createDir, createFile, insertToFile, checkFileExists} from '../utils';
import {removeFile, removeWholeLine} from './utils';
import {getConfig} from '../config_utils';
import {logger} from '../logger';
import path from 'path';
import {outputFileSync} from 'fs-extra';

const makeRelative = (from, to) => {
  const relativePath = path.relative(from, to);
  // add ./ if its child
  if(!_.startsWith(relativePath, ".")) {
    return "./"+relativePath;
  }
  return relativePath;
};
export function generateModule(name, options, customConfig = {}) {
  const config = getConfig(customConfig);
  let snakeCaseName = _.snakeCase(name);
  const storybookConfigFile = `.storybook/config.js`;
  const modulePath = `./${config.modulesPath}/${snakeCaseName}`;

  const templatesPath = `${__dirname}/../../templates`;
  createDir(modulePath);
  createDir(`${modulePath}/components`);
  createDir(`${modulePath}/containers`);
  createDir(`${modulePath}/configs`);
  createDir(`${modulePath}/libs`);
  createFile(`${templatesPath}/client/modules/core/actions/index.js`,
    `${modulePath}/actions/index.js`);
  createFile(`${templatesPath}/client/modules/core/index.js`,
    `${modulePath}/index.js`);
  createFile(`${templatesPath}/client/modules/core/routes.tt`,
    `${modulePath}/routes.${config.jsxExtension}`);
  if(name === 'core') {
    createFile(`${templatesPath}/client/modules/core/components/main_layout.${config.jsxExtension}`,
           `${modulePath}/components/main_layout.${config.jsxExtension}`);
     createFile(`${templatesPath}/client/modules/core/components/home.${config.jsxExtension}`,
            `${modulePath}/components/home.${config.jsxExtension}`);
  }

  // Modify client/main.js to import and load the newly generated module
  const clientDir = "./client";
  const clientMain = `${clientDir}/main.js`;
  const modulePathRelative = makeRelative(clientDir, modulePath);
  insertToFile(clientMain,
  `import ${snakeCaseName}Module from '${modulePathRelative}';`,
  {
    or: [
      {
        after: {
          regex: /import .*Module from \'\.\/modules\/.*\';/g,
          last: true
        },
        asNewLine: true
      },
      {
        after: {
          regex: /\/\/ modules/g,
        },
        asNewLine: true
      }
    ]
  });

  insertToFile(clientMain,
  `app.loadModule(${snakeCaseName}Module);`,
  {
    or: [
      {
        after: {
          regex: /app.loadModule\(.*Module\);/g,
          last: true
        },
        asNewLine: true
      },
      {
        after: {
          regex:  /\/\/ load modules/g,
        },
        asNewLine: true
      }
    ]
  });

  if (config.storybook) {
    const moduleStoriesDir = `${modulePath}/components/${config.storiesFolder}`;
    const moduleStoriesIndex = `${moduleStoriesDir}/index.js`;
    addToStorybookConfig({storybookConfigFile, moduleStoriesIndex, config});
    createDir(moduleStoriesDir);
    createFile(`${templatesPath}/client/modules/core/components/.stories/index.js`,
      moduleStoriesIndex);
  }
}

const storyRequireStatement = storyFile =>
  `require('${path.relative("./.storybook", storyFile)}');`;

function addToStorybookConfig({storybookConfigFile, moduleStoriesIndex, config}) {
  const statement = storyRequireStatement(moduleStoriesIndex);
  let tab = _.repeat(' ', config.tabSize);
  // avoid duplicates
  removeFromStorybookConfig({storybookConfigFile, moduleStoriesIndex});
  insertToFile(storybookConfigFile, tab+statement,
    {after: {regex: /loadStories[^{]*{/g},asNewLine: true}
  );
}

function removeFromStorybookConfig({storybookConfigFile, moduleStoriesIndex}) {
  let content = fs.readFileSync(storybookConfigFile, {encoding: 'utf-8'});
  const statement = storyRequireStatement(moduleStoriesIndex);
  content = removeWholeLine(content, statement);
  outputFileSync(storybookConfigFile, content);
}


export function destroyModule(name, options, customConfig) {
  const config = getConfig(customConfig);
  let snakeCaseName = _.snakeCase(name);
  const modulePath = `./${config.modulesPath}/${snakeCaseName}`;
  removeFile(modulePath);

  const storybookConfigFile = `.storybook/config.js`;
  if (checkFileExists(storybookConfigFile)) {
    const moduleStoriesIndex = `${modulePath}/components/${config.storiesFolder}/index.js`;
    removeFromStorybookConfig({storybookConfigFile, moduleStoriesIndex});
  }
  const clientDir = "./client";
  const clientMain = `${clientDir}/main.js`;
  const modulePathRelative = makeRelative(clientDir, modulePath);

  logger.update(clientMain);
  let content = fs.readFileSync(clientMain, {encoding: 'utf-8'});
  content = removeWholeLine(content,
    `import ${snakeCaseName}Module from '${modulePathRelative}';`);
  content = removeWholeLine(content, `app.loadModule(${snakeCaseName}Module);`);

  fs.writeFileSync(clientMain, content);
}
