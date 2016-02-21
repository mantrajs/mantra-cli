import {_generate} from './utils';

export default function generateContainer(name) {
  let [moduleName, entityName] = name.split(':');

  _generate('container', moduleName, entityName);
  _generate('component', moduleName, entityName);
}
