import _ from 'lodash';
import {_generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath} from './utils';

export function generatePublication(name, options, config) {
  const {exists} = _generate('publication', null, name, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./server/publications/index.js`,
      exportBeginning: 'export default function () {',
      insertImport: `import ${name} from './${_.snakeCase(name)}';`,
      insertExport: `  ${name}();`
    });
  }
}

export function destroyPublication(name) {
  removeFile(getOutputPath('publication', name));

  removeFromIndexFile(`./server/publications/index.js`, name);
}
