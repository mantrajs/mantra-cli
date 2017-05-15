import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';

import * as commands from '../dist/commands';

const testDirPath = path.resolve(__dirname);
const tmpDirPath = path.resolve(__dirname, 'tmp');
const testAppPath = path.resolve(__dirname, tmpDirPath, 'blog');

export function setupTestApp() {
  // let consoleLog = console.log;

  // console.log = function() {}; // Suppress console.log
  fse.mkdirsSync(tmpDirPath);
  process.chdir(tmpDirPath);

  commands.create(testAppPath);
  process.chdir(testAppPath);

  fse.outputFileSync('./.meteor/packages', 'test');
  // console.log = consoleLog; // Resotre console.log
}

export function teardownTestApp() {
  process.chdir(testDirPath);
  fse.removeSync(testAppPath);
}

export function checkFileOrDirExists(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }

    throw e;
  }

  return true;
}
