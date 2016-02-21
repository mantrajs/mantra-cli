import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {mkdirsSync, copySync, outputFileSync} from 'fs-extra';
import {template, capitalize} from 'lodash';
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
function getTemplatePath(type) {
  let relativePath;

  if (type === 'collection') {
    relativePath = '../../templates/lib/collections/generic.tt';
  } else if (type === 'method') {
    relativePath =  `../../templates/server/methods/generic.tt`;
  } else if (type === 'publication') {
    relativePath = '../../templates/server/publications/generic.tt';
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
function readTemplateContent(type) {
  let templatePath = getTemplatePath(type);

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
    return {componentName: capitalize(fileName)};
  } else if (type === 'container') {
    return {
      componentName: capitalize(fileName),
      componentFileName: fileName
    };
  } else if (type === 'collection') {
    return {
      collectionName: capitalize(fileName),
      collectionFileName: fileName
    };
  } else if (type === 'method') {
    return {
      collectionName: capitalize(fileName),
      methodFileName: fileName
    };
  } else if (type === 'publication') {
    return {
      collectionName: capitalize(fileName),
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
 */
export function updateIndexFile({indexFilePath, exportBeginning, insertImport, insertExport}) {

  function findExportLineTarget() {
    let indexContent = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
    let exportBeginningRegex = new RegExp(_.escapeRegExp(exportBeginning), 'g');

    let exportBeginningPos = locater.findOne(exportBeginningRegex, indexContent);
    let bracketCursor = exportBeginning.indexOf('{') + 1; // cursor at which the bracket appears on the line where export block starts
    let matchedBracketPos = matchBracket(indexContent, _.assign(exportBeginningPos, {cursor: bracketCursor}));

    return matchedBracketPos.line;
  }

  // Insert the import statement at the top portion of the file
  writeToFile(indexFilePath, insertImport,
    {or: [
      {after: {regex: /import .*\n/g, last: true}, asNewLine: true},
      {before: {line: 1}, asNewLine: true, _appendToModifier: '\n'}
    ]}
  );

  // Insert within the export block if needed
  writeToFile(indexFilePath, insertExport,
    {before: {line: findExportLineTarget()}, asNewLine: true}
  );

  logger.update(indexFilePath);
}

export function _generate(type, moduleName, entityName, done) {
  let templateContent = readTemplateContent(type);
  let outputPath = getOutputPath(type, entityName, moduleName);
  let templateVariables = getTemplateVaraibles(type, entityName);
  let component = template(templateContent)(templateVariables);

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
