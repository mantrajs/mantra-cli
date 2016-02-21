import {mkdirsSync, copySync} from 'fs-extra';
import {logger} from '../logger';

function createDir(path) {
  mkdirsSync(path);

  let displayPath = path.replace(/^\.\//, '')
                        .replace(/$/, '/');
  logger.create(displayPath);
}

function createFile(templatePath, targetPath) {
  copySync(templatePath, targetPath);

  let displayPath = targetPath.replace(/^\.\//, '');
  logger.create(displayPath);
}

export default function create(appName) {
  createDir(`./${appName}`);
  createDir(`./${appName}/client`);
  createFile(`${__dirname}/../../templates/client/configs/context.js`,
           `./${appName}/client/configs/context.js`);
  createFile(`${__dirname}/../../templates/client/modules/main.js`,
           `./${appName}/client/modules/main.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/index.js`,
           `./${appName}/client/modules/core/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/routes.jsx`,
           `./${appName}/client/modules/core/routes.jsx`);
  createFile(`${__dirname}/../../templates/client/modules/core/actions/index.js`,
           `./${appName}/client/modules/core/actions/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/components/main_layout.jsx`,
           `./${appName}/client/modules/core/components/main_layout.jsx`);

  createFile(`${__dirname}/../../templates/lib/collections/index.js`,
           `./${appName}/lib/collections/index.js`);

  createDir(`./${appName}/server/configs`);
  createFile(`${__dirname}/../../templates/server/main.js`,
           `./${appName}/server/main.js`);
  createFile(`${__dirname}/../../templates/server/methods/index.js`,
           `./${appName}/server/methods/index.js`);
  createFile(`${__dirname}/../../templates/server/publications/index.js`,
           `./${appName}/server/publications/index.js`);
}
