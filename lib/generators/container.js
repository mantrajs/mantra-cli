import {_generate, ensureModuleNameProvided, ensureModuleExists} from './utils';

export default function generateContainer(name, options) {
  let [moduleName, entityName] = name.split(':');

  ensureModuleNameProvided(name);
  ensureModuleExists(moduleName);

  _generate('container', moduleName, entityName, options);
  _generate('component', moduleName, entityName, options);
}
