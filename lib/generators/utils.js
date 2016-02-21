import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {mkdirsSync, copySync, outputFileSync} from 'fs-extra';
import {template, capitalize} from 'lodash';
import matchBracket from 'match-bracket';
import locater from 'locater';
import {writeToFile, checkFileExists} from '../utils';
import {logger} from '../logger';

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

function getTemplatePath(type, moduleName) {
  let relativePath;

  if (type === 'collection') {
    relativePath = '../../templates/lib/collections/generic.tt';
  } else if (type === 'method') {
    relativePath =  `../../templates/server/methods/generic.tt`;
  } else if (type === 'publication') {
    relativePath = '../../templates/server/publications/generic.tt';
  } else {
    relativePath = `../../templates/client/modules/${moduleName}/${type}s/generic.tt`;
  }

  return path.resolve(__dirname, relativePath);
}

function readTemplateContent(type, moduleName) {
  let templatePath = getTemplatePath(type, moduleName);

  return fs.readFileSync(templatePath);
}

function getTemplateVaraibles(type, entityName) {
  if (type === 'component') {
    return {componentName: capitalize(entityName)};
  } else if (type === 'container') {
    return {
      componentName: capitalize(entityName),
      componentFileName: entityName
    };
  } else if (type === 'collection') {
    return {
      collectionName: capitalize(entityName),
      collectionFileName: entityName
    };
  } else if (type === 'method') {
    return {
      collectionName: capitalize(entityName),
      methodFileName: entityName
    };
  } else if (type === 'publication') {
    return {
      collectionName: capitalize(entityName),
      publicationFileName: entityName
    };
  }

  return {};
}

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
  let templateContent = readTemplateContent(type, moduleName);
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
