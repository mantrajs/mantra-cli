import fs from 'fs';
import _ from 'lodash';
import {createDir, createFile, insertToFile} from '../utils';
import {removeFile, removeWholeLine} from './utils';
import {logger} from '../logger';
import {mkdirsSync} from 'fs-extra';

export function generateModule(name) {
  let snakeCaseName = _.snakeCase(name);

  mkdirsSync(`./client/modules/${snakeCaseName}`);
  mkdirsSync(`./client/modules/${snakeCaseName}/components`);
  mkdirsSync(`./client/modules/${snakeCaseName}/containers`);
  mkdirsSync(`./client/modules/${snakeCaseName}/configs`);
  mkdirsSync(`./client/modules/${snakeCaseName}/libs`);
  createFile(`${__dirname}/../../templates/client/modules/core/actions/index.js`,
    `client/modules/${snakeCaseName}/actions/index.js`);
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
}

export function destroyModule(name) {
  let snakeCaseName = _.snakeCase(name);

  removeFile(`./client/modules/${snakeCaseName}`);

  let mainFilePath = './client/main.js';
  logger.update(mainFilePath);
  let content = fs.readFileSync(mainFilePath, {encoding: 'utf-8'});
  content = removeWholeLine(content,
    `import ${snakeCaseName}Module from './modules/${snakeCaseName}';`);
  content = removeWholeLine(content, `app.loadModule(${snakeCaseName}Module);`);

  fs.writeFileSync(mainFilePath, content);
}
