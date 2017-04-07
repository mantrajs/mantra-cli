import _ from 'lodash';
import {_generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath} from './utils';
import {getConfig} from '../config_utils';

export function generateMethod(name, options, customConfig) {
  const config = getConfig(customConfig);
  const {exists} = _generate('method', null, name, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./server/methods/index.js`,
      exportBeginning: 'export default function () {',
      insertImport: `import ${name} from './${_.snakeCase(name)}';`,
      insertExport: `  ${name}();`
    });
  }
}

export function destroyMethod(name) {
  removeFile(getOutputPath('method', name));

  removeFromIndexFile(`./server/methods/index.js`, name);

}
