import _ from 'lodash';
import {_generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath, getFileName} from './utils';
import {getConfig} from '../config_utils';
export function generatePublication(name, options, customConfig) {
  const config = getConfig(customConfig);
  const {exists} = _generate('publication', null, name, options, config);

  if (!exists) {
    updateIndexFile({
      indexFilePath: `./server/publications/index.js`,
      exportBeginning: 'export default function () {',
      insertImport: `import ${name} from './${getFileName(customConfig, name)}';`,
      insertExport: `  ${name}();`
    });
  }
}

export function destroyPublication(name, options, customConfig) {
  removeFile(getOutputPath(customConfig, 'publication', name));

  removeFromIndexFile(`./server/publications/index.js`, name, customConfig);
}
