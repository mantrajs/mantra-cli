import {readConfig} from '../utils';
import {destroyAction} from '../generators/action';
import {destroyComponent} from '../generators/component';
import {destroyContainer} from '../generators/container';
import {destroyCollection} from '../generators/collection';
import {destroyMethod} from '../generators/method';
import {destroyPublication} from '../generators/publication';
import {destroyModule} from '../generators/module';

export default function destroy(type, name, options = {}) {
  let destroyFn = getDestroyFn(type);
  let config = readConfig();
  if (! destroyFn) {
    console.log(`Invalid type ${type}`);
    console.log('Run `mantra generate --help` for more options.');
    return;
  }

  destroyFn(name, options, config);
}

function getDestroyFn(type) {
  const destroyFnMap = {
    action: destroyAction,
    component: destroyComponent,
    container: destroyContainer,
    collection: destroyCollection,
    method: destroyMethod,
    publication: destroyPublication,
    module: destroyModule
  };

  return destroyFnMap[type];
}
