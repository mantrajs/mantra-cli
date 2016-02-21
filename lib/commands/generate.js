import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {mkdirsSync, copySync, outputFileSync} from 'fs-extra';
import {template, capitalize} from 'lodash';
import {writeToFile} from '../utils';
import matchBracket from 'match-bracket';
import {findOne} from 'locater';
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

function checkFileExists(path) {
  try {
    fs.lstatSync(path);
  } catch (e) {
    return false;
  }

  return true;
}

export default function generate(type, name) {
  let moduleName, entityName;
  if (name.indexOf(':') === -1) {
    entityName = name;
  } else {
    [moduleName, entityName] = name.split(':');
  }

  function _generate(type, moduleName, entityName, done) {
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

  if (type === 'container') {
    _generate('container', moduleName, entityName);
    _generate('component', moduleName, entityName);
  } else if (type === 'component') {
    _generate('component', moduleName, entityName);
  } else if (type === 'action') {
    _generate('action', moduleName, entityName, function () {
      let indexFilePath = `./client/modules/${moduleName}/actions/index.js`;
      writeToFile(indexFilePath,
        `import ${entityName} from './${entityName}';`,
        {or: [
          {after: {regex: /import .*\n/g, last: true}, asNewLine: true},
          {before: {line: 1}, asNewLine: true, _appendToModifier: '\n'}
        ]});

      let content = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
      let exportBlockStartPos = findOne(/export default {/g, content);
      const bracketCursor = 16; // cursor at which the bracket appears in the line where export block starts
      let matchedBracketPos = matchBracket(content, _.assign(exportBlockStartPos, {cursor: bracketCursor}));

      writeToFile(indexFilePath, `  ${entityName}`,
        {before: {line: matchedBracketPos.line}, asNewLine: true});

      logger.update(indexFilePath);
    });
  } else if (type === 'collection') {
    _generate('collection', null, entityName, function () {
      let indexFilePath = `./lib/collections/index.js`;
      writeToFile(indexFilePath,
        `import ${entityName} from './${entityName}';`,
        {or: [
          {after: {regex: /import .*\n/g, last: true}, asNewLine: true},
          {before: {line: 1}, asNewLine: true, _appendToModifier: '\n'}
        ]});

      let content = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
      let exportBlockStartPos = findOne(/export {/g, content);
      const bracketCursor = 8; // cursor at which the bracket appears in the line where export block starts
      let matchedBracketPos = matchBracket(content, _.assign(exportBlockStartPos, {cursor: bracketCursor}));

      writeToFile(indexFilePath, `  ${entityName}`,
        {before: {line: matchedBracketPos.line}, asNewLine: true});

      logger.update(indexFilePath);
    });
  } else if (type === 'method') {
    _generate('method', null, entityName, function () {
      let indexFilePath = `./server/methods/index.js`;
      writeToFile(indexFilePath,
        `import ${entityName} from './${entityName}';`,
        {or: [
          {after: {regex: /import .*\n/g, last: true}, asNewLine: true},
          {before: {line: 1}, asNewLine: true, _appendToModifier: '\n'}
        ]});

      let content = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
      let exportBlockStartPos = findOne(/export default function \(\) {/g, content);
      const bracketCursor = 28; // cursor at which the bracket appears in the line where export block starts
      let matchedBracketPos = matchBracket(content, _.assign(exportBlockStartPos, {cursor: bracketCursor}));

      writeToFile(indexFilePath, `  ${entityName}();`,
        {before: {line: matchedBracketPos.line}, asNewLine: true});

      logger.update(indexFilePath);
    });
  } else if (type === 'publication') {
    _generate('publication', null, entityName);
    let indexFilePath = `./server/publications/index.js`;
    writeToFile(indexFilePath,
      `import ${entityName} from './${entityName}';`,
      {or: [
        {after: {regex: /import .*\n/g, last: true}, asNewLine: true},
        {before: {line: 1}, asNewLine: true, _appendToModifier: '\n'}
      ]});

    let content = fs.readFileSync(indexFilePath, {encoding: 'utf-8'});
    let exportBlockStartPos = findOne(/export default function \(\) {/g, content);
    const bracketCursor = 28; // cursor at which the bracket appears in the line where export block starts
    let matchedBracketPos = matchBracket(content, _.assign(exportBlockStartPos, {cursor: bracketCursor}));

    writeToFile(indexFilePath, `  ${entityName}();`,
      {before: {line: matchedBracketPos.line}, asNewLine: true});

    logger.update(indexFilePath);
  }
}
