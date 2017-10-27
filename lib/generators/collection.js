import { _generate, updateIndexFile, removeFromIndexFile, removeFile, getOutputPath, getFileName, pascalCase } from './utils';
import { getLineBreak } from '../utils';
import shelljs from 'shelljs/shell';
import fs from 'fs';
import _ from 'lodash';
import { logger } from '../logger';
import {getConfig} from '../config_utils';

export function generateCollection(name, options, customConfig) {
  const config = getConfig(customConfig);
  const {exists} = _generate('collection', null, name, options, config);
  const entityName = pascalCase(name);
  if (!exists) {
    updateIndexFile({
      indexFilePath: `./lib/collections/index.js`,
      exportBeginning: 'export {',
      insertImport: `import ${entityName} from './${getFileName(customConfig, entityName)}';`,
      insertExport: `  ${entityName}`,
      commaDelimited: true
    });
  }

  let packageList = fs.readFileSync('./.meteor/packages');

  if (options.schema === 'collection2') {
    // if no aldeed:collection2, or commented out
    if (!(/aldeed\:collection2/).test(packageList) || (/#+\s*aldeed\:collection2/).test(packageList)) {
      logger.invoke('add_collection_2');
      const lineBreak = getLineBreak();
      `aldeed:collection2${lineBreak}`.toEnd('.meteor/packages');
    }
  } else if (options.schema === 'astronomy') {
    // if no jagi:astronomy, or commented out
    if (!(/jagi\:astronomy/).test(packageList) || (/#+\s*jagi\:astronomy/).test(packageList)) {
      logger.invoke('add_astronomy');
      const lineBreak = getLineBreak();
      `jagi:astronomy${lineBreak}`.toEnd('.meteor/packages');
    }
  }
}

export function destroyCollection(name, options, customConfig) {
  removeFile(getOutputPath(customConfig, 'collection', name));

  removeFromIndexFile(`./lib/collections/index.js`, name, { capitalizeVarName: true }, customConfig);
}
