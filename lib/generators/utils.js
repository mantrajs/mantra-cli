import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import _ from 'lodash';
import {mkdirsSync, copySync, outputFileSync, removeSync} from 'fs-extra';
import matchBracket from 'match-bracket';
import locater from 'locater';
import inflect from 'i';

import {insertToFile, checkFileExists, readConfig} from '../utils';
import {logger} from '../logger';
import {getConfig} from '../config_utils';

/**
 * Gets the output path of the file that will be generated.
 * @param type {String} - the type of file to be generated. See extensionMap
 *        for the supported values.
 * @param entityName {String} - the name of the file that will be generated
 * @param [moduleName] {String} - the name of the module under which the file will
 *        be generated
 * @return String - the output path relative to the app root
 */
export function getOutputPath(customConfig, type, entityName, moduleName) {
  const config = getConfig(customConfig);
  const extensionMap = {
    action: 'js',
    component: 'jsx',
    configs: 'js',
    container: 'js',
    collection: 'js',
    method: 'js',
    publication: 'js',
    storybook: 'js'
  };
  let extension = extensionMap[type];
  let outputFileName = `${_.snakeCase(entityName)}.${extension}`;
  const modulePath = `./${config.modulesPath}/${moduleName}`;

  if (type === 'collection') {
    return `./lib/collections/${outputFileName}`;
  } else if (type === 'method') {
    return `./server/methods/${outputFileName}`;
  } else if (type === 'publication') {
    return `./server/publications/${outputFileName}`;
  } else if (type === 'storybook') {
    return `${modulePath}/components/.stories/${outputFileName}`;
  } else {
    return `${modulePath}/${type}s/${outputFileName}`;
  }
}

/**
 * getTestOutputPath gets the output path for the test file. It is similar to
 * getOutputPath function.
 *
 * @param type {String} - the type of file to be generated. See extensionMap
 *        for the supported values.
 * @param entityName {String} - the name of the file that will be generated
 * @param [moduleName] {String} - the name of the module under which the file will
 *        be generated
 * @return String - the output path relative to the app root
 */
export function getTestOutputPath(type, entityName, moduleName) {
  let outputFileName = `${_.snakeCase(entityName)}.js`;
  return `./client/modules/${moduleName}/${type}s/tests/${outputFileName}`;
}

/**
 * Gets the path to the generic template inside mantra-cli given the type.
 * @param type {String} - type of the file being generated.
 * @return String - the absolute path to the generic template inside mantra-cli
 *         for the given file type.
 */
export function getTemplatePath(type, options = {}) {
  let relativePath;

  if (options.testTemplate) {
    if (type === 'component') {
      relativePath = '../../templates/client/modules/core/components/tests/test.tt';
    } else if (type === 'container') {
      relativePath = '../../templates/client/modules/core/containers/tests/test.tt';
    } else if (type === 'action') {
      relativePath = '../../templates/client/modules/core/actions/tests/test.tt';
    }
  } else {
    if (type === 'collection') {
      if (options.schema === 'collection2') {
        relativePath = '../../templates/lib/collections/generic_collection2.tt';
      } else if (options.schema === 'astronomy') {
        relativePath = '../../templates/lib/collections/generic_astronomy.tt';
      } else {
        relativePath = '../../templates/lib/collections/generic.tt';
      }
    } else if (type === 'method') {
      relativePath =  `../../templates/server/methods/generic.tt`;
    } else if (type === 'publication') {
      relativePath = '../../templates/server/publications/generic.tt';
    } else if (type === 'component') {
      if (options.useClass) {
        relativePath = `../../templates/client/modules/core/components/generic_class.tt`;
      } else {
        relativePath = `../../templates/client/modules/core/components/generic_stateless.tt`;
      }
    } else if (type === 'storybook') {
      relativePath = `../../templates/client/modules/core/components/.stories/storybook.tt`;
    } else {
      relativePath = `../../templates/client/modules/core/${type}s/generic.tt`;
    }
  }

  return path.resolve(__dirname, relativePath);
}

/**
 * Reads the content of a generic template for the file type
 * @param type {String} - type of the file. See getOutputPath's extensionMap for
 *        all valid types
 * @param templateOptions {Object} - options to be passed to functions for
 *        getting the template path.
 * @param config {Object} - global configuration for Mantra CLI. This may contain
 *        custom template content
 * @return Buffer - the content of the template for the given type
 */
export function readTemplateContent(type, templateOptions, config) {
  // First, try to get custom template from config
  // If cannot find custom template, return the default
  if (checkForCustomTemplate(config, type, templateOptions)) {
    let templateConfig = getCustomTemplate(config, type, templateOptions);
    return templateConfig.text;
  } else {
    let templatePath = getTemplatePath(type, templateOptions);
    return fs.readFileSync(templatePath);
  }
}

function getCustomTemplate(config, entityType, {testTemplate = false}) {
  const selector = {name: entityType};
  if(testTemplate) {
    selector.test = true;
  }
  const templateConfig = _.find(config.templates, selector);

  return templateConfig;
}

/**
 * Checks if there is a custom template defined in the config
 * for the given entity type
 * @param config {Object} - global configuration for Mantra CLI.
 * @param entityType {String} - type of the file
 * @param options {Object} - options to be passed to functions for
 *        getting the template path.
 * @return Boolean
 */
function checkForCustomTemplate(config, entityType, options) {
  if (!config.templates) {
    return false;
  }
  const template = getCustomTemplate(config, entityType, options);
  return !_.isEmpty(template);
}

/**
 * Gets the variables to be passed to the generic template to be evaluated by
 * a template engine.
 * @param type {String} - type of the template
 * @param fileName {String} - name of the file being generated
 * @return {Object} - key-values pairs of variable names and their values
 */
export function getTemplateVaraibles(type, moduleName, fileName, options = {}) {
  if (type === 'component') {
    return {
      moduleName: _.snakeCase(moduleName),
      componentName: _.upperFirst(_.camelCase(fileName))
    };
  } else if (type === 'storybook') {
    return {
      moduleName: _.snakeCase(moduleName),
      componentName: _.upperFirst(_.camelCase(fileName)),
      componentFileName: _.snakeCase(fileName)
    };
  } else if (type === 'container') {
    return {
      moduleName: _.snakeCase(moduleName),
      componentName: _.upperFirst(_.camelCase(fileName)),
      componentFileName: _.snakeCase(fileName)
    };
  } else if (type === 'collection') {
    let variables = {
      collectionName: _.upperFirst(_.camelCase(fileName)),
      collectionFileName: _.snakeCase(fileName)
    };

    if (options.schema === 'astronomy') {
      variables.className = _.upperFirst(inflect().singularize(fileName));
    }

    return variables;
  } else if (type === 'method') {
    return {
      collectionName: _.upperFirst(_.camelCase(fileName)),
      methodFileName: _.snakeCase(fileName)
    };
  } else if (type === 'publication') {
    return {
      collectionName: _.upperFirst(_.camelCase(fileName)),
      publicationFileName: _.snakeCase(fileName)
    };
  }

  return {};
}

/**
 * Gets the variables to be passed to the test template.
 * @param type {String} - type of the template
 * @param moduleName {String} - name of the module the test belongs
 * @param fileName {String} - name of the file which the test is for
 * @return {Object} - key-values pairs of variable names and their values
 */
export function getTestTemplateVaraibles(type, moduleName, fileName) {
  if (type === 'action') {
    return {
      actionFileName: _.snakeCase(fileName),
      moduleName: _.snakeCase(moduleName)
    };
  } else if (type === 'component') {
    return {
      componentName: _.upperFirst(_.camelCase(fileName)),
      componentFileName: _.snakeCase(fileName),
      moduleName: _.snakeCase(moduleName)
    };
  } else if (type === 'container') {
    return {
      containerFileName: _.snakeCase(fileName),
      moduleName: _.snakeCase(moduleName)
    };
  }
}

/**
 * Updates a relevant index.js file by inserting an import statement at the top
 * portion of the file, and a statement inside the export block.
 * Uses locater, and matchBracket to pinpoint the position at which the
 * statements are to be inserted.
 *
 * @param {Object}
 *        - indexFilePath: the path to the index file to be modified
 *        - exportBeginning: the content of the line on which the export block
 *          begins
 *        - insertImport: the import statement to be inserted at the top portion
 *          of the file
 *        - insertExport: the statement to be inserted inside the export block
 *        - commaDelimited: whether the items in the export blocks are separated
 *          by commas.
 *          e.g. export default { posts, users } // => commaDelimited is true
 *        - omitExport: whether to add export-statement (defaults to true)
 */
export function updateIndexFile({indexFilePath, exportBeginning, insertImport, insertExport, commaDelimited, omitExport = false}) {
  if (!checkFileExists(indexFilePath)) {
    logger.missing(indexFilePath);
    return;
  }

  function analyzeExportBlock() {
    let indexContent = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
    let exportBeginningRegex = new RegExp(_.escapeRegExp(exportBeginning), 'g');

    let exportBeginningPos = locater.findOne(exportBeginningRegex, indexContent);
    let bracketCursor = exportBeginning.indexOf('{') + 1; // cursor at which the bracket appears on the line where export block starts
    let matchedBracketPos = matchBracket(indexContent, _.assign(exportBeginningPos, {cursor: bracketCursor}));

    return {
      beginningLine: exportBeginningPos.line,
      endLine: matchedBracketPos.line,
      isEmpty: exportBeginningPos.line === matchedBracketPos.line - 1
    };
  }

  logger.update(indexFilePath);

  // Insert the import statement at the top portion of the file
  insertToFile(indexFilePath, insertImport,
    {or: [
      {after: {regex: /import .*\n/g, last: true}, asNewLine: true},
      {before: {line: 1}, asNewLine: true, _appendToModifier: '\n'}
    ]}
  );
  if(!omitExport) {
    // Insert within the export block and modify the block content as needed
    let info = analyzeExportBlock();

    if (!info.isEmpty && commaDelimited) {
      insertToFile(indexFilePath, ',', {after: {line: info.endLine - 1}});
    }
    insertToFile(indexFilePath, insertExport,
      {before: {line: info.endLine}, asNewLine: true}
    );
  }
}

/**
 * Removes from the string the whole line on which the pattern appears. Useful
 * when removing import and export lines from index files
 *
 * @param string {String} - a string to be modified
 * @param pattern {String|RegExp} - pattern to be matched against the `string`
 */
export function removeWholeLine(string, pattern) {

  function nthIndexOf(str, part, n) {
    let len = str.length;
    let i = -1;

    while (n-- && i++ < len) {
      i = str.indexOf(part, i);
      if (i < 0) break;
    }

    return i;
  }
  let position = locater.findOne(pattern, string);

  if (! position) {
    return string;
  }

  let lineNumber = position.line;
  let lineStartIndex = nthIndexOf(string, '\n', lineNumber - 1) + 1;
  let lineEndIndex = nthIndexOf(string, '\n', lineNumber);

  return string.substring(0, lineStartIndex) + string.substring(lineEndIndex + 1);
}

/**
 * Remove the import and export statement for an entity from the index file
 * specified by the path
 *
 * @param indexFilePath {String} - the path to the index.js file to be modified
 * @param entityName {String} - the name of the entity whose import and export
 *        statements to be removed from the index file
 */
export function removeFromIndexFile(indexFilePath, entityName, options = {}) {
  if (!checkFileExists(indexFilePath)) {
    logger.missing(indexFilePath);
    return;
  }
  logger.update(indexFilePath);
  let varName = options.capitalizeVarName ?
    _.capitalize(_.camelCase(entityName)) : _.camelCase(entityName);

  let regex = new RegExp(`  ${varName}.*\n`, 'g');

  let content = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
  content = removeWholeLine(content,
    `import ${varName} from './${_.snakeCase(entityName)}';`);
  content = removeWholeLine(content, regex);

  outputFileSync(indexFilePath, content);
}

/**
 * Removes a file at the given path
 * @param path {String} - the path to the file to be removed
 */
export function removeFile(path) {
  logger.remove(path);
  removeSync(path);
}

/**
 * Compiles a template given content and variables. Reads and applies user
 * configurations.
 * @param content {String} - template content
 * @param variables {Object} - variable names and values to be passed to the
 *        template and evaluated
 * @param config {Object} - Mantra config
 * @return {String} - compiled content
 */
export function compileTemplate(content, variables, config) {
  let compiled = _.template(content)(variables);
  let tab = _.repeat(' ', config.tabSize);
  const defaultTabSize = 2;

  // TODO: windows newline
  // customize tabSpace by replacing spaces followed by newline
  return compiled.replace(/(\n|\r\n)( +)/g, function (match, lineBreak, defaultTab) {
    let numTabs = defaultTab.length / defaultTabSize;
    return lineBreak + _.repeat(tab, numTabs);
  });
}

/**
 * A generic function for generating entities. Used by generators for each
 * types
 *
 * @param type {String} - type of the entity to be generated
 * @param moduleName {String} - name of the module that the entity belongs
 *        applicable for client entities. Set to `null` if not applicable
 * @param entityName {String} - name of the entity to be generated
 * @param options {Object} - options passed by the CLI
 * @param config {Object} - global configuration of the CLI
 * @return {String} - path to the generated file
 */
export function _generate(type, moduleName, entityName, options, customConfig) {
  const config = getConfig(customConfig);
  let templateContent = readTemplateContent(type, options, config);
  let outputPath = getOutputPath(customConfig, type, entityName, moduleName);
  let templateVariables = getTemplateVaraibles(type, moduleName, entityName, options);
  let component = compileTemplate(templateContent, templateVariables, config);

  if (checkFileExists(outputPath)) {
    logger.exists(outputPath);
    return {exists: true, outputPath};
  }

  fse.outputFileSync(outputPath, component);
  logger.create(outputPath);
  return {exists: false, outputPath};
}

export function _generateTest(type, moduleName, entityName, config) {
  let templateContent = readTemplateContent(type, {testTemplate: true}, config);
  let outputPath = getTestOutputPath(type, entityName, moduleName);
  let templateVariables = getTestTemplateVaraibles(type, moduleName, entityName);
  let component = _.template(templateContent)(templateVariables);

  if (checkFileExists(outputPath)) {
    logger.exists(outputPath);
    return outputPath;
  }

  fse.outputFileSync(outputPath, component);
  logger.create(outputPath);
  return outputPath;
}

/**
 * Checks if the given string follows the format of moduleName:entityName
 * @return {Boolean} - true if validation passes, false otherwise
 */
export function checkForModuleName(str) {
  let re = /.*\:.*/;
  return re.test(str);
}

/**
 * Checks if name is in the format of `moduleName:entityName`. Exits the process
 * if the validation fails
 *
 * @param name {String} - name to validate
 */
export function ensureModuleNameProvided(name) {
  if (! checkForModuleName(name)) {
    console.log(`Invalid name: ${name}. Did you remember to provide the module name?`);
    console.log('Run `mantra generate --help` for more options.');
    process.exit(1);
  }
}

/**
 * Checks if module with the given name exists. Exits the process if the module
 * does not exist
 *
 * @param moduleName {String} - name of the module to check if exists
 */
export function ensureModuleExists(moduleName, customConfig = {}) {
  const config = getConfig(customConfig);
  if (! checkFileExists(`./${config.modulesPath}/${moduleName}`)) {
    console.log(`A module named ${moduleName} does not exist. Try to generate it first.`);
    console.log('Run `mantra generate --help` for more options.');
    process.exit(1);
  }
}
