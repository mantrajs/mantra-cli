import {createDir, createFile} from '../utils';

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
}
