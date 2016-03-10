import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import {createDir, getFileContent, createFile, getLineBreak} from '../utils';
import {logger} from '../logger';
import shelljs from 'shelljs/shell';

export default function create(appPath) {
  const lineBreak = getLineBreak();
  let appName = path.basename(appPath).replace(/\..*$/, '');

  createDir(`./${appPath}`);

  if (process.env.NODE_ENV !== 'test') {
    logger.invoke('init');
    shelljs.set('-e');
    let currentPath = shelljs.pwd();
    shelljs.exec(`meteor create ${appPath} --release 1.3-beta.16`, {silent: true});
    shelljs.cd(appPath);
    shelljs.rm('*.css','*.html','*.js');
    `kadira:flow-router${lineBreak}`.toEnd('.meteor/packages');
    shelljs.cd(currentPath);
  }

  createFile(`${__dirname}/../../templates/client/configs/context.js`,
           `./${appPath}/client/configs/context.js`);
  createFile(`${__dirname}/../../templates/client/main.js`,
           `./${appPath}/client/main.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/index.js`,
           `./${appPath}/client/modules/core/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/routes.jsx`,
           `./${appPath}/client/modules/core/routes.jsx`);
  createDir(`./${appPath}/client/modules/core/containers`);
  createDir(`./${appPath}/client/modules/core/configs`);
  createFile(`${__dirname}/../../templates/client/modules/core/actions/index.js`,
           `./${appPath}/client/modules/core/actions/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/components/main_layout.jsx`,
           `./${appPath}/client/modules/core/components/main_layout.jsx`);
  createFile(`${__dirname}/../../templates/client/modules/core/components/home.jsx`,
           `./${appPath}/client/modules/core/components/home.jsx`);

  createFile(`${__dirname}/../../templates/lib/collections/index.js`,
           `./${appPath}/lib/collections/index.js`);

  createDir(`./${appPath}/server/configs`);
  createFile(`${__dirname}/../../templates/server/main.js`,
           `./${appPath}/server/main.js`);
  createFile(`${__dirname}/../../templates/server/methods/index.js`,
           `./${appPath}/server/methods/index.js`);
  createFile(`${__dirname}/../../templates/server/publications/index.js`,
           `./${appPath}/server/publications/index.js`);

  createFile(`${__dirname}/../../templates/package.tt`,
          `./${appPath}/package.json`, {appName: appName});
  createFile(`${__dirname}/../../templates/gitignore.tt`,
          `./${appPath}/.gitignore`);

  if (process.env.NODE_ENV !== 'test') {
    logger.invoke('after_init');
    shelljs.set('-e');
    let currentPath = shelljs.pwd();
    shelljs.cd(appPath);
    shelljs.exec('npm install', {silent: true});
    shelljs.cd(currentPath);
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
