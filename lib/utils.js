import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';
import editer from 'editer';
import _ from 'lodash';
import {mkdirsSync, outputFileSync} from 'fs-extra';
import {logger} from './logger';

function editFile(type, pathToFile, string, options) {
  let fileContent = fs.readFileSync(pathToFile, {encoding: 'utf-8'});
  let updatedContent;

  if (type === 'insert') {
    updatedContent = editer.insert(string, fileContent, options);
  } else if (type === 'remove') {
    updatedContent = editer.remove(string, fileContent, options);
  }

  fs.writeFileSync(pathToFile, updatedContent);
}

/**
 * Writes a string on the file at the given path, at a location specified by
 * options. Uses 'editer' module under the hood the find the exact location of
 * the insertion.
 *
 * @param pathToFile {String} - the path to the file. Can be either absolute or
 *        relative.
 */
export function insertToFile(pathToFile, string, options) {
  editFile('insert', pathToFile, string, options);
}

export function removeFromFile(pathToFile, string, options) {
  editFile('remove', pathToFile, string, options);
}

/**
 * Creates a directory and displays a message in the console
 *
 * @param path {String} - the path on which the directory is to be created
 */
export function createDir(path) {
  mkdirsSync(path);

  let displayPath = path.replace(/^\.\//, '')
                        .replace(/$/, '/');
  logger.create(displayPath);
}

/**
 * Reads the content of the template file and evaluates template variables
 * in the template if necessary
 *
 * @param templatePath {String} - the path to the template file
 * @param templateVariables {Object} - key value pairs of variables to be
 *        evaluated in the template
 */
export function getFileContent(templatePath, templateVariables) {
  let templateContent = fs.readFileSync(templatePath);

  if (templateVariables) {
    return _.template(templateContent)(templateVariables);
  } else {
    return templateContent;
  }
}

/**
 * Creates a file at a given path using the template and template variables
 * provided. Logs a message on the console.
 * If the parent directory does not exist, recursively create parent directories
 * by using `fs-extra` module.
 *
 * @param templatePath {String} - the path to the template file
 * @param targetPath {String} - the path on which the file is to be generated
 * @param templateVariables {Object} - key value pairs of variables to be
 *        evaluated in the template
 */
export function createFile(templatePath, targetPath, templateVariables) {
  let fileContent = getFileContent(templatePath, templateVariables);
  outputFileSync(targetPath, fileContent);

  let displayPath = targetPath.replace(/^\.\//, '');
  logger.create(displayPath);
}

/**
 * Executes a command. Logs a message in the console.
 *
 * @param cmd {String} - the command to execute
 * @param options {Object} - options to be provided to child_process.execSync
 */
export function executeCommand(cmd, options) {
  logger.run(cmd);
  execSync(cmd, options);
}

/**
 * Checks if a file or directory exists at the given path
 * @param path {String} - the path to the file or directory. Can be either
 *        absolute or relative.
 * @return Boolean - true if the file or directory exists. Otherwise false.
 */
export function checkFileExists(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }

  return true;
}

export function runScriptFile(pathToScript, args = [], options = {}) {
  let scriptName = path.basename(pathToScript).replace(/\..*$/, '');

  logger.invoke(scriptName);
  let commandPrefix = isWindows()?'': 'bash';
  execSync(`${commandPrefix} ${pathToScript} ${args.join(' ')}`, options);
}

export function isWindows(){
  return /^win/.test(process.platform);
}