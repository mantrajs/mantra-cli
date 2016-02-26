import {_generate} from './utils';

export default function generateComponent(name, options) {
  let [moduleName, entityName] = name.split(':');

  _generate('component', moduleName, entityName, options);
}
