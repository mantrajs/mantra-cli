import {_generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath} from './utils';
import {capitalize} from 'lodash';

export function generateCollection(name, options) {
  _generate('collection', null, name, options);
  updateIndexFile({
    indexFilePath: `./lib/collections/index.js`,
    exportBeginning: 'export {',
    insertImport: `import ${capitalize(name)} from './${name}';`,
    insertExport: `  ${capitalize(name)}`,
    commaDelimited: true
  });
}

export function destroyCollection(name) {
  removeFile(getOutputPath('collection', name));

  removeFromIndexFile(`./lib/collections/index.js`, name);
}
