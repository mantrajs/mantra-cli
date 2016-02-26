import {_generate, ensureModuleNameProvided, ensureModuleExists} from './utils';

export default function generateComponent(name, options) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  _generate('component', moduleName, entityName, options);
}
