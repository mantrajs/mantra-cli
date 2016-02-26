import {_generate, updateIndexFile} from './utils';

export default function generateMethod(name) {
  _generate('method', null, name);
  updateIndexFile({
    indexFilePath: `./server/methods/index.js`,
    exportBeginning: 'export default function () {',
    insertImport: `import ${name} from './${name}';`,
    insertExport: `  ${name}();`
  });
}
