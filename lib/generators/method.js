import {_generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath} from './utils';

export function generateMethod(name) {
  _generate('method', null, name);
  updateIndexFile({
    indexFilePath: `./server/methods/index.js`,
    exportBeginning: 'export default function () {',
    insertImport: `import ${name} from './${name}';`,
    insertExport: `  ${name}();`
  });
}

export function destroyMethod(name) {
  removeFile(getOutputPath('method', name));

  removeFromIndexFile(`./server/methods/index.js`, name);

}
