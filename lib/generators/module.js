import {createDir, createFile} from '../utils';
import {writeToFile} from '../utils';

export default function generateModule(name) {
  createDir(`./client/modules/${name}`);
  createDir(`./client/modules/${name}/components`);
  createDir(`./client/modules/${name}/containers`);
  createDir(`./client/modules/${name}/configs`);
  createFile(`${__dirname}/../../templates/client/modules/core/actions/index.js`,
    `client/modules/${name}/actions/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/index.js`,
    `client/modules/${name}/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/routes.tt`,
    `client/modules/${name}/routes.jsx`);

  // Modify client/main.js to import and load the newly generated module
  writeToFile('./client/main.js',
  `import ${name}Module from './modules/${name}';`,
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

  writeToFile('./client/main.js',
  `app.loadModule(${name}Module);`,
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
