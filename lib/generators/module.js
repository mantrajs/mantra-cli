import fs from 'fs';
import _ from 'lodash';
import {createDir, createFile, insertToFile} from '../utils';
import {removeFile, removeWholeLine} from './utils';
import {logger} from '../logger';
import path from 'path';
import {outputFileSync} from 'fs-extra'

export function generateModule(name, options, config) {
  let snakeCaseName = _.snakeCase(name);
  const storybookConfigFile = `.storybook/config.js`;
  const moduleStoriesIndex = `client/modules/${snakeCaseName}/components/.stories/index.js`
  createDir(`./client/modules/${snakeCaseName}`);
  createDir(`./client/modules/${snakeCaseName}/components`);
  createDir(`./client/modules/${snakeCaseName}/components/.stories`);
  createDir(`./client/modules/${snakeCaseName}/containers`);
  createDir(`./client/modules/${snakeCaseName}/configs`);
  createDir(`./client/modules/${snakeCaseName}/libs`);
  createFile(`${__dirname}/../../templates/client/modules/core/actions/index.js`,
    `client/modules/${snakeCaseName}/actions/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/components/.stories/index.js`,
    moduleStoriesIndex);
  createFile(`${__dirname}/../../templates/client/modules/core/index.js`,
    `client/modules/${snakeCaseName}/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/routes.tt`,
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
  addToStorybookConfig({storybookConfigFile, moduleStoriesIndex, config})

}

const storyRequireStatement = storyFile =>
  `require('${path.relative("./.storybook", storyFile)}');`

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
  const statement = storyRequireStatement(moduleStoriesIndex)
  console.log("removing", statement, "from", storybookConfigFile)
  content = removeWholeLine(content, statement);
  outputFileSync(storybookConfigFile, content);
}


export function destroyModule(name) {
  let snakeCaseName = _.snakeCase(name);
  const storybookConfigFile = `.storybook/config.js`;
  const moduleStoriesIndex = `client/modules/${snakeCaseName}/components/.stories/index.js`
  removeFromStorybookConfig({storybookConfigFile, moduleStoriesIndex});
  removeFile(`./client/modules/${snakeCaseName}`);

  let mainFilePath = './client/main.js';
  logger.update(mainFilePath);
  let content = fs.readFileSync(mainFilePath, {encoding: 'utf-8'});
  content = removeWholeLine(content,
    `import ${snakeCaseName}Module from './modules/${snakeCaseName}';`);
  content = removeWholeLine(content, `app.loadModule(${snakeCaseName}Module);`);

  fs.writeFileSync(mainFilePath, content);
}
