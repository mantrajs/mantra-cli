import {_generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath} from './utils';

export function generatePublication(name) {
  _generate('publication', null, name);
  updateIndexFile({
    indexFilePath: `./server/publications/index.js`,
    exportBeginning: 'export default function () {',
    insertImport: `import ${name} from './${name}';`,
    insertExport: `  ${name}();`
  });
}

export function destroyPublication(name) {
  removeFile(getOutputPath('publication', name));

  removeFromIndexFile(`./server/publications/index.js`, name);
}
