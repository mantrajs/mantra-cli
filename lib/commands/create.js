import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import {createDir, getFileContent, createFile, getLineBreak} from '../utils';
import {logger} from '../logger';
import shelljs from 'shelljs/shell';

export default function create(appPath, options) {
  if (!appPath) {
    console.log('Please supply the path of project');
    console.log('Run `mantra create --help` for more options.');
    return;
  }
  const lineBreak = getLineBreak();
  let appName = path.basename(appPath).replace(/\..*$/, '');
  let release = '1.3-rc.3'

  createDir(`${appPath}`);

  if (process.env.NODE_ENV !== 'test') {
    logger.invoke('init');
    shelljs.set('-e');
    let currentPath = shelljs.pwd();

    if (options.verbose)
    {
      let isExist = parseInt(shelljs.exec(`meteor show --show-all meteor | grep ${release} | grep -q 'installed' ; echo $?`, {silent: true}).output)
      !!isExist && logger.invoke(`Installing a meteor ${release}...`);
    }

    shelljs.exec(`meteor create ${appPath} --release ${release}`, {silent: !options.verbose});
    shelljs.cd(appPath);
    shelljs.rm('-rf', ['client', 'server']);
    `kadira:flow-router${lineBreak}`.toEnd('.meteor/packages');
    shelljs.cd(currentPath);
  }

  createFile(`${__dirname}/../../templates/client/configs/context.js`,
           `${appPath}/client/configs/context.js`);
  createFile(`${__dirname}/../../templates/client/main.js`,
           `${appPath}/client/main.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/index.js`,
           `${appPath}/client/modules/core/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/routes.jsx`,
           `${appPath}/client/modules/core/routes.jsx`);
  createDir(`${appPath}/client/modules/core/containers`);
  createDir(`${appPath}/client/modules/core/configs`);
  createFile(`${__dirname}/../../templates/client/modules/core/actions/index.js`,
           `${appPath}/client/modules/core/actions/index.js`);
  createFile(`${__dirname}/../../templates/client/modules/core/components/main_layout.jsx`,
           `${appPath}/client/modules/core/components/main_layout.jsx`);
  createFile(`${__dirname}/../../templates/client/modules/core/components/home.jsx`,
           `${appPath}/client/modules/core/components/home.jsx`);

  createFile(`${__dirname}/../../templates/lib/collections/index.js`,
           `${appPath}/lib/collections/index.js`);

  createDir(`${appPath}/server/configs`);
  createFile(`${__dirname}/../../templates/server/main.js`,
           `${appPath}/server/main.js`);
  createFile(`${__dirname}/../../templates/server/methods/index.js`,
           `${appPath}/server/methods/index.js`);
  createFile(`${__dirname}/../../templates/server/publications/index.js`,
           `${appPath}/server/publications/index.js`);

  createFile(`${__dirname}/../../templates/package.tt`,
          `${appPath}/package.json`, {appName: appName});
  createFile(`${__dirname}/../../templates/gitignore.tt`,
          `${appPath}/.gitignore`);
  createFile(`${__dirname}/../../templates/eslintrc.tt`,
          `${appPath}/.eslintrc`);

  if (process.env.NODE_ENV !== 'test') {
    logger.invoke('after_init');
    shelljs.set('-e');
    let currentPath = shelljs.pwd();
    shelljs.cd(appPath);
    shelljs.exec('npm install', {silent: !options.verbose});
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
