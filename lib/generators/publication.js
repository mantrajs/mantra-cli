import {_generate, updateIndexFile} from './utils';

export default function generatePublication(name) {
  _generate('publication', null, name, function () {
    updateIndexFile({
      indexFilePath: `./server/publications/index.js`,
      exportBeginning: 'export default function () {',
      insertImport: `import ${name} from './${name}';`,
      insertExport: `  ${name}();`
    });
  });
}
