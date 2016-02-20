import {mkdirsSync, copySync, outputFile} from 'fs-extra';

// TODO: use outputFile instead of mkdirSycn and copySync?
export default function create(appName) {
  mkdirsSync(`./${appName}`);

  mkdirsSync(`./${appName}/client/configs`);
  mkdirsSync(`./${appName}/client/modules/core/actions`);
  mkdirsSync(`./${appName}/client/modules/core/components`);
  mkdirsSync(`./${appName}/client/modules/core/configs`);
  mkdirsSync(`./${appName}/client/modules/core/containers`);
  copySync(`${__dirname}/../../templates/client/configs/context.js`,
           `./${appName}/client/configs/context.js`);
  copySync(`${__dirname}/../../templates/client/modules/main.js`,
           `./${appName}/client/modules/main.js`);
  copySync(`${__dirname}/../../templates/client/modules/core/index.js`,
           `./${appName}/client/modules/core/index.js`);
  copySync(`${__dirname}/../../templates/client/modules/core/routes.jsx`,
           `./${appName}/client/modules/core/routes.jsx`);
  copySync(`${__dirname}/../../templates/client/modules/core/actions/index.js`,
           `./${appName}/client/modules/core/actions/index.js`);
  copySync(`${__dirname}/../../templates/client/modules/core/components/main_layout.jsx`,
           `./${appName}/client/modules/core/components/main_layout.jsx`);

  mkdirsSync(`./${appName}/lib/collections`);
  copySync(`${__dirname}/../../templates/lib/collections/index.js`,
           `./${appName}/lib/collections/index.js`);

  mkdirsSync(`./${appName}/server/configs`);
  mkdirsSync(`./${appName}/server/methods`);
  mkdirsSync(`./${appName}/server/publications`);
  copySync(`${__dirname}/../../templates/server/main.js`,
           `./${appName}/server/main.js`);
  copySync(`${__dirname}/../../templates/server/publications/index.js`,
           `./${appName}/publications/index.js`);
}
