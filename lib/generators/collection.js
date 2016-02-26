import {_generate, updateIndexFile} from './utils';
import {capitalize} from 'lodash';

export default function generateCollection(name) {
  _generate('collection', null, name);
  updateIndexFile({
    indexFilePath: `./lib/collections/index.js`,
    exportBeginning: 'export {',
    insertImport: `import ${capitalize(name)} from './${name}';`,
    insertExport: `  ${capitalize(name)}`,
    commaDelimited: true
  });
}
