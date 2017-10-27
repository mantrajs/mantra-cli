import _ from 'lodash';
import {_generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath, getFileName} from './utils';
import {getConfig} from '../config_utils';

export function generateMethod(name, options, customConfig) {
  const config = getConfig(customConfig);
  const {exists} = _generate('method', null, name, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./server/methods/index.js`,
      exportBeginning: 'export default function () {',
      insertImport: `import ${name} from './${getFileName(customConfig, name)}';`,
      insertExport: `  ${name}();`
    });
  }
}

export function destroyMethod(name, options, customConfig) {
  removeFile(getOutputPath(customConfig, 'method', name));

  removeFromIndexFile(`./server/methods/index.js`, name, customConfig);

}
