import {_generate, updateIndexFile} from './utils';

export default function generatePublication(name) {
  _generate('publication', null, name);
  updateIndexFile({
    indexFilePath: `./server/publications/index.js`,
    exportBeginning: 'export default function () {',
    insertImport: `import ${name} from './${name}';`,
    insertExport: `  ${name}();`
  });
}
