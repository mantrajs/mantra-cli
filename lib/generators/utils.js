import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {mkdirsSync, copySync, outputFileSync} from 'fs-extra';
import matchBracket from 'match-bracket';
import locater from 'locater';

import {writeToFile, checkFileExists} from '../utils';
import {logger} from '../logger';

/**
 * Gets the output path of the file that will be generated.
 * @param type {String} - the type of file to be generated. See extensionMap
 *        for the supported values.
 * @param entityName {String} - the name of the file that will be generated
 * @param [moduleName] {String} - the name of the module under which the file will
 *        be generated
 * @return String - the output path relative to the app root
 */
function getOutputPath(type, entityName, moduleName) {
  const extensionMap = {
    action: 'js',
    component: 'jsx',
    configs: 'js',
    container: 'js',
    collection: 'js',
    method: 'js',
    publication: 'js'
  };
  let extension = extensionMap[type];
  let outputFileName = `${entityName}.${extension}`;

  if (type === 'collection') {
    return `./lib/collections/${outputFileName}`;
  } else if (type === 'method') {
    return `./server/methods/${outputFileName}`;
  } else if (type === 'publication') {
    return `./server/publications/${outputFileName}`;
  } else {
    return `./client/modules/${moduleName}/${type}s/${outputFileName}`;
  }
}

/**
 * Gets the path to the generic template inside mantra-cli given the type.
 * @param type {String} - type of the file being generated.
 * @return String - the absolute path to the generic template inside mantra-cli
 *         for the given file type.
 */
function getTemplatePath(type, options) {
  let relativePath;

  if (type === 'collection') {
    relativePath = '../../templates/lib/collections/generic.tt';
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
  } else {
    relativePath = `../../templates/client/modules/core/${type}s/generic.tt`;
  }

  return path.resolve(__dirname, relativePath);
}

/**
 * Reads the content of a generic template for the file type
 * @param type {String} - type of the file. See getOutputPath's extensionMap for
 *        all valid types
 * @return Buffer - the content of the template for the given type
 */
function readTemplateContent(type, options) {
  let templatePath = getTemplatePath(type, options);

  return fs.readFileSync(templatePath);
}

/**
 * Gets the variables to be passed to the generic template to be evaluated by
 * a template engine.
 * @param type {String} - type of the template
 * @param fileName {String} - name of the file being generated
 * @return Object - key-values pairs of variable names and their values
 */
function getTemplateVaraibles(type, fileName) {
  if (type === 'component') {
    return {componentName: _.capitalize(fileName)};
  } else if (type === 'container') {
    return {
      componentName: _.capitalize(fileName),
      componentFileName: fileName
    };
  } else if (type === 'collection') {
    return {
      collectionName: _.capitalize(fileName),
      collectionFileName: fileName
    };
  } else if (type === 'method') {
    return {
      collectionName: _.capitalize(fileName),
      methodFileName: fileName
    };
  } else if (type === 'publication') {
    return {
      collectionName: _.capitalize(fileName),
      publicationFileName: fileName
    };
  }

  return {};
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
 */
export function updateIndexFile({indexFilePath, exportBeginning, insertImport, insertExport, commaDelimited}) {

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

  // Insert the import statement at the top portion of the file
  writeToFile(indexFilePath, insertImport,
    {or: [
      {after: {regex: /import .*\n/g, last: true}, asNewLine: true},
      {before: {line: 1}, asNewLine: true, _appendToModifier: '\n'}
    ]}
  );

  // Insert within the export block and modify the block content as needed
  let info = analyzeExportBlock();

  if (!info.isEmpty && commaDelimited) {
    writeToFile(indexFilePath, ',', {after: {line: info.endLine - 1}});
  }
  writeToFile(indexFilePath, insertExport,
    {before: {line: info.endLine}, asNewLine: true}
  );

  logger.update(indexFilePath);
}

export function _generate(type, moduleName, entityName, options, done) {
  let templateContent = readTemplateContent(type, options);
  let outputPath = getOutputPath(type, entityName, moduleName);
  let templateVariables = getTemplateVaraibles(type, entityName);
  let component = _.template(templateContent)(templateVariables);

  if (checkFileExists(outputPath)) {
    logger.exists(outputPath);
    return;
  }

  fs.writeFileSync(outputPath, component);
  logger.create(outputPath);

  if (done) {
    done();
  }
}

/**
 * Checks if name is in the format of `moduleName:entityName`. Exits the process
 * if the validation fails
 *
 * @param name {String} - name to validate
 */
export function ensureModuleNameProvided(name) {
  if (! /.*\:.*/.test(name)) {
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
export function ensureModuleExists(moduleName) {
  if (! checkFileExists(`./client/modules/${moduleName}`)) {
    console.log(`A module named ${moduleName} does not exist. Try to generate it first.`);
    console.log('Run `mantra generate --help` for more options.');
    process.exit(1);
  }
}
