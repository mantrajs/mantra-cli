import {_generate} from './utils';

export default function generateContainer(name, options) {
  let [moduleName, entityName] = name.split(':');

  _generate('container', moduleName, entityName, options);
  _generate('component', moduleName, entityName, options);
}
