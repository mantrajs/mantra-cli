import {_generate, updateIndexFile} from './utils';

export default function generateAction(name) {
  let [moduleName, entityName] = name.split(':');

  _generate('action', moduleName, entityName);
  updateIndexFile({
    indexFilePath: `./client/modules/${moduleName}/actions/index.js`,
    exportBeginning: 'export default {',
    insertImport: `import ${entityName} from './${entityName}';`,
    insertExport: `  ${entityName}`,
    commaDelimited: true
  });
}
