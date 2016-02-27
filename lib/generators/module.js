import _ from 'lodash';
import {createDir, createFile} from '../utils';
import {insertToFile} from '../utils';

export function generateModule(name) {
  let snakeCaseName = _.snakeCase(name);

  createDir(`./client/modules/${snakeCaseName}`);
  createDir(`./client/modules/${snakeCaseName}/components`);
  createDir(`./client/modules/${snakeCaseName}/containers`);
  createDir(`./client/modules/${snakeCaseName}/configs`);
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
