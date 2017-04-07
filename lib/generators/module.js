import fs from 'fs';
import _ from 'lodash';
import {createDir, createFile, insertToFile, checkFileExists} from '../utils';
import {removeFile, removeWholeLine} from './utils';
import {logger} from '../logger';
import path from 'path';
import {outputFileSync} from 'fs-extra';

export function generateModule(name, options, config) {
  let snakeCaseName = _.snakeCase(name);
  const storybookConfigFile = `.storybook/config.js`;
  const modulePath = `./${config.modulesPath}/${snakeCaseName}`;
  console.log("modulePath", config, modulePath);
  const moduleStoriesIndex = `${modulePath}/components/.stories/index.js`;
  const templatesPath = `${__dirname}/../../templates`;
  createDir(modulePath);
  createDir(`${modulePath}/components`);
  createDir(`${modulePath}/components/.stories`);
  createDir(`${modulePath}/containers`);
  createDir(`${modulePath}/configs`);
  createDir(`${modulePath}/libs`);
  createFile(`${templatesPath}/client/modules/core/actions/index.js`,
    `client/modules/${snakeCaseName}/actions/index.js`);
  createFile(`${templatesPath}/client/modules/core/index.js`,
    `client/modules/${snakeCaseName}/index.js`);
  createFile(`${templatesPath}/client/modules/core/routes.tt`,
    `client/modules/${snakeCaseName}/routes.jsx`);

  // Modify client/main.js to import and load the newly generated module
  insertToFile('./client/main.js',
  `import ${snakeCaseName}Module from './modules/${snakeCaseName}';`,
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

  insertToFile('./client/main.js',
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
          regex: /\/\/ create app/g,
        },
        asNewLine: true
      }
    ]
  });

  if (config.storybook) {
    addToStorybookConfig({storybookConfigFile, moduleStoriesIndex, config});
    createFile(`${templatesPath}/client/modules/core/components/.stories/index.js`,
      moduleStoriesIndex);
  }
}

const storyRequireStatement = storyFile =>
  `require('${path.relative("./.storybook", storyFile)}');`;

function addToStorybookConfig({storybookConfigFile, moduleStoriesIndex, config}) {
  const statement = storyRequireStatement(moduleStoriesIndex);
  let tab = ' '.repeat(config.tabSize);
  // avoid duplicates
  removeFromStorybookConfig({storybookConfigFile, moduleStoriesIndex});
  insertToFile(storybookConfigFile, tab+statement,
    {after: {regex: /loadStories[^{]*{/g},asNewLine: true}
  );
}

function removeFromStorybookConfig({storybookConfigFile, moduleStoriesIndex}) {
  let content = fs.readFileSync(storybookConfigFile, {encoding: 'utf-8'});
  const statement = storyRequireStatement(moduleStoriesIndex);
  console.log("removing", statement, "from", storybookConfigFile);
  content = removeWholeLine(content, statement);
  outputFileSync(storybookConfigFile, content);
}


export function destroyModule(name, options, config) {
  let snakeCaseName = _.snakeCase(name);
  const modulePath = `./${config.modulesPath}/${snakeCaseName}`;
  removeFile(modulePath);

  const storybookConfigFile = `.storybook/config.js`;
  if (checkFileExists(storybookConfigFile)) {
    const moduleStoriesIndex = `${modulePath}/components/.stories/index.js`;
    removeFromStorybookConfig({storybookConfigFile, moduleStoriesIndex});
  }

  let mainFilePath = './client/main.js';
  logger.update(mainFilePath);
  let content = fs.readFileSync(mainFilePath, {encoding: 'utf-8'});
  content = removeWholeLine(content,
    `import ${snakeCaseName}Module from './modules/${snakeCaseName}';`);
  content = removeWholeLine(content, `app.loadModule(${snakeCaseName}Module);`);

  fs.writeFileSync(mainFilePath, content);
}
