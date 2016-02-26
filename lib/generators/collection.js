import {_generate, updateIndexFile} from './utils';

export default function generateCollection(name) {
  _generate('collection', null, name, function () {
    updateIndexFile({
      indexFilePath: `./lib/collections/index.js`,
      exportBeginning: 'export {',
      insertImport: `import ${name} from './${name}';`,
      insertExport: `  ${name}`,
      commaDelimited: true
    });
  });
}
